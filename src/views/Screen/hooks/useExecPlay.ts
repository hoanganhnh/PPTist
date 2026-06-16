import { onMounted, onUnmounted, ref, watch } from 'vue'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { KEYS } from '@/configs/hotkey'
import { ANIMATION_CLASS_PREFIX } from '@/configs/animation'
import message from '@/utils/message'
import type { Slide } from '@/types/slides'

const AUDIENCE_SYNC_CHANNEL = 'pptist-audience-sync'

type SyncMessage =
  | { type: 'EXEC_NEXT' }
  | { type: 'EXEC_PREV' }
  | { type: 'TURN_TO_INDEX'; index: number }
  | { type: 'TURN_TO_ID'; id: string }
  | { type: 'REQUEST_STATE' }
  | { type: 'INIT_STATE'; slideIndex: number; animationIndex: number; slides: Slide[] }
  | { type: 'REQUEST_WRITING_BOARD' }
  | { type: 'WRITING_BOARD_UPDATE'; dataURL: string; blackboard: boolean }
  | { type: 'WRITING_BOARD_CLOSE' }
  | { type: 'LASER_PEN_MOVE'; x: number; y: number }
  | { type: 'LASER_PEN_OFF' }
  | { type: 'EXIT' }

export default () => {
  const slidesStore = useSlidesStore()
  const { slides, slideIndex, formatedAnimations } = storeToRefs(slidesStore)

  const isAudienceMode = new URLSearchParams(window.location.search).get('mode') === 'audience'

  // Presenter mode: create broadcast channel to sync controls to Audience View
  let syncChannel: BroadcastChannel | null = null
  if (!isAudienceMode) {
    syncChannel = new BroadcastChannel(AUDIENCE_SYNC_CHANNEL)
    syncChannel.onmessage = ({ data }: MessageEvent<SyncMessage>) => {
      if (data.type === 'REQUEST_STATE') {
        syncChannel!.postMessage({
          type: 'INIT_STATE',
          slideIndex: slideIndex.value,
          animationIndex: animationIndex.value,
          slides: JSON.parse(JSON.stringify(slides.value)),
        } as SyncMessage)
      }
    }
  }

  // Current slide element animation progress position
  const animationIndex = ref(0)

  // Animation execution state
  const inAnimation = ref(false)

  // Minimum played slide index
  const playedSlidesMinIndex = ref(slideIndex.value)

  // Execute element animation
  const runAnimation = () => {
    // Prevent triggering new animations while an animation is currently playing
    if (inAnimation.value) return

    const { animations, autoNext } = formatedAnimations.value[animationIndex.value]
    animationIndex.value += 1

    // Mark start of animation execution
    inAnimation.value = true

    let endAnimationCount = 0

    // Execute all animations in this sequence in order
    for (const animation of animations) {
      const elRef: HTMLElement | null = document.querySelector(`#screen-element-${animation.elId} [class^=base-element-]`)
      if (!elRef) {
        endAnimationCount += 1
        continue
      }

      const animationName = `${ANIMATION_CLASS_PREFIX}${animation.effect}`
      
      // Clear previous animation states if any before playing
      elRef.style.removeProperty('--animate-duration')
      for (const classname of elRef.classList) {
        if (classname.indexOf(ANIMATION_CLASS_PREFIX) !== -1) elRef.classList.remove(classname, `${ANIMATION_CLASS_PREFIX}animated`)
      }
      
      // Execute animation
      elRef.style.setProperty('--animate-duration', `${animation.duration}ms`)
      elRef.classList.add(animationName, `${ANIMATION_CLASS_PREFIX}animated`)

      // Complete animation, clear states except exit animation status
      const handleAnimationEnd = () => {
        if (animation.type !== 'out') {
          elRef.style.removeProperty('--animate-duration')
          elRef.classList.remove(animationName, `${ANIMATION_CLASS_PREFIX}animated`)
        }

        // If all animations at this index completed, mark sequence done and continue to next if auto-triggered
        endAnimationCount += 1
        if (endAnimationCount === animations.length) {
          inAnimation.value = false
          if (autoNext) runAnimation()
        }
      }
      elRef.addEventListener('animationend', handleAnimationEnd, { once: true })
    }
  }

  onMounted(() => {
    const firstAnimations = formatedAnimations.value[0]
    if (firstAnimations && firstAnimations.animations.length) {
      const autoExecFirstAnimations = firstAnimations.animations.every(item => item.trigger === 'auto' || item.trigger === 'meantime')
      if (autoExecFirstAnimations) runAnimation()
    }
  })

  // Apply final DOM state of executed exit animations (for Audience View sync)
  // Entrance animation visibility is controlled by animationIndex + needWaitAnimation, no extra handling needed
  // Emphasis animations have no persistent effect, no action needed
  const restoreAnimationState = (targetIndex: number) => {
    for (let i = 0; i < targetIndex && i < formatedAnimations.value.length; i++) {
      const { animations } = formatedAnimations.value[i]
      for (const animation of animations) {
        if (animation.type !== 'out') continue
        const elRef: HTMLElement | null = document.querySelector(`#screen-element-${animation.elId} [class^=base-element-]`)
        if (!elRef) continue
        const animationName = `${ANIMATION_CLASS_PREFIX}${animation.effect}`
        elRef.style.setProperty('--animate-duration', '0ms')
        elRef.classList.add(animationName, `${ANIMATION_CLASS_PREFIX}animated`)
      }
    }
  }

  // Undo element animation: revert index and clear animation states
  const revokeAnimation = () => {
    animationIndex.value -= 1
    const { animations } = formatedAnimations.value[animationIndex.value]

    for (const animation of animations) {
      const elRef: HTMLElement | null = document.querySelector(`#screen-element-${animation.elId} [class^=base-element-]`)
      if (!elRef) continue
      
      elRef.style.removeProperty('--animate-duration')
      for (const classname of elRef.classList) {
        if (classname.indexOf(ANIMATION_CLASS_PREFIX) !== -1) elRef.classList.remove(classname, `${ANIMATION_CLASS_PREFIX}animated`)
      }
    }

    // If only emphasis animation exists at this position on undo, trigger undo again
    if (animations.every(item => item.type === 'attention')) execPrev(false)
  }

  // CloseAuto Play
  const autoPlayTimer = ref(0)
  const closeAutoPlay = () => {
    if (autoPlayTimer.value) {
      clearInterval(autoPlayTimer.value)
      autoPlayTimer.value = 0
    }
  }
  onUnmounted(closeAutoPlay)

  // Loop Slideshow
  const loopPlay = ref(false)
  const setLoopPlay = (loop: boolean) => {
    loopPlay.value = loop
  }

  const throttleMassage = throttle(function(msg) {
    message.success(msg)
  }, 1000, { leading: true, trailing: false })

  // Play previous/next animation
  // Play element animations first; flip slide if no animations remain
  // Reverting animations on 'Prev': undo to state before animation, do not play backwards
  // Undo transition: if slide was not played, set animation index to 0; else set to end
  const execPrev = (broadcast = true) => {
    if (broadcast) syncChannel?.postMessage({ type: 'EXEC_PREV' } as SyncMessage)
    if (formatedAnimations.value.length && animationIndex.value > 0) {
      revokeAnimation()
    }
    else if (slideIndex.value > 0) {
      slidesStore.updateSlideIndex(slideIndex.value - 1)
      if (slideIndex.value < playedSlidesMinIndex.value) {
        animationIndex.value = 0
        playedSlidesMinIndex.value = slideIndex.value
      }
      else animationIndex.value = formatedAnimations.value.length
    }
    else {
      if (loopPlay.value) turnSlideToIndex(slides.value.length - 1)
      else throttleMassage('Already the first slide')
    }
    inAnimation.value = false
  }
  const execNext = () => {
    syncChannel?.postMessage({ type: 'EXEC_NEXT' } as SyncMessage)
    if (formatedAnimations.value.length && animationIndex.value < formatedAnimations.value.length) {
      runAnimation()
    }
    else if (slideIndex.value < slides.value.length - 1) {
      slidesStore.updateSlideIndex(slideIndex.value + 1)
      animationIndex.value = 0
      inAnimation.value = false
    }
    else {
      if (loopPlay.value) turnSlideToIndex(0)
      else {
        throttleMassage('Already the last slide')
        closeAutoPlay()
      }
      inAnimation.value = false
    }
  }

  // Auto Play
  const autoPlayInterval = ref(2500)
  const autoPlay = () => {
    closeAutoPlay()
    message.success('Start Auto Slideshow')
    autoPlayTimer.value = setInterval(execNext, autoPlayInterval.value)
  }

  const setAutoPlayInterval = (interval: number) => {
    closeAutoPlay()
    autoPlayInterval.value = interval
    autoPlay()
  }

  // Scroll cursor to flip slides
  const mousewheelListener = throttle(function(e: WheelEvent) {
    if (e.deltaY < 0) execPrev()
    else if (e.deltaY > 0) execNext()
  }, 500, { leading: true, trailing: false })

  // Swipe up/down on touchscreen to flip slides
  const touchInfo = ref<{ x: number; y: number; } | null>(null)

  const touchStartListener = (e: TouchEvent) => {
    touchInfo.value = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY,
    }
  }
  const touchEndListener = (e: TouchEvent) => {
    if (!touchInfo.value) return

    const offsetX = Math.abs(touchInfo.value.x - e.changedTouches[0].pageX)
    const offsetY = e.changedTouches[0].pageY - touchInfo.value.y

    if ( Math.abs(offsetY) > offsetX && Math.abs(offsetY) > 50 ) {
      touchInfo.value = null

      if (offsetY > 0) execPrev()
      else execNext()
    }
  }

  // Keyboard shortcuts flip slides
  const keydownListener = throttle(function(e: KeyboardEvent) {
    const key = e.key.toUpperCase()

    if (key === KEYS.UP || key === KEYS.LEFT || key === KEYS.PAGEUP) execPrev()
    else if (
      key === KEYS.DOWN || 
      key === KEYS.RIGHT ||
      key === KEYS.SPACE || 
      key === KEYS.ENTER ||
      key === KEYS.PAGEDOWN
    ) execNext()
  }, 500, { leading: true, trailing: false })

  onMounted(() => {
    if (!isAudienceMode) document.addEventListener('keydown', keydownListener)
  })
  onUnmounted(() => {
    if (!isAudienceMode) document.removeEventListener('keydown', keydownListener)
    syncChannel?.close()
  })

  // Transition to previous slide (ignoring element entrance animations)
  const turnPrevSlide = () => {
    slidesStore.updateSlideIndex(slideIndex.value - 1)
    animationIndex.value = 0
  }
  const turnNextSlide = () => {
    slidesStore.updateSlideIndex(slideIndex.value + 1)
    animationIndex.value = 0
  }

  // Transition to specified slide
  const turnSlideToIndex = (index: number) => {
    syncChannel?.postMessage({ type: 'TURN_TO_INDEX', index } as SyncMessage)
    slidesStore.updateSlideIndex(index)
    animationIndex.value = 0
  }
  const turnSlideToId = (id: string) => {
    const index = slides.value.findIndex(slide => slide.id === id)
    if (index !== -1) {
      syncChannel?.postMessage({ type: 'TURN_TO_ID', id } as SyncMessage)
      slidesStore.updateSlideIndex(index)
      animationIndex.value = 0
    }
  }

  // Laser pointer status and position broadcast
  const laserPen = ref(false)

  const handleLaserMove = (e: MouseEvent) => {
    const slideEl = document.querySelector('.screen-slide-list .slide-item.current .slide-content') as HTMLElement | null
    if (!slideEl) return
    const rect = slideEl.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    syncChannel?.postMessage({ type: 'LASER_PEN_MOVE', x, y } as SyncMessage)
  }

  // Throttle/Stream version of handleLaserMove
  const throttledHandleLaserMove = throttle(handleLaserMove, 30, { leading: true, trailing: true })

  watch(laserPen, active => {
    if (active) {
      document.addEventListener('mousemove', throttledHandleLaserMove)
    }
    else {
      document.removeEventListener('mousemove', throttledHandleLaserMove)
      syncChannel?.postMessage({ type: 'LASER_PEN_OFF' } as SyncMessage)
    }
  })

  const broadcastExit = () => {
    syncChannel?.postMessage({ type: 'EXIT' } as SyncMessage)
  }

  return {
    autoPlayTimer,
    autoPlayInterval,
    setAutoPlayInterval,
    autoPlay,
    closeAutoPlay,
    loopPlay,
    setLoopPlay,
    mousewheelListener,
    touchStartListener,
    touchEndListener,
    turnPrevSlide,
    turnNextSlide,
    turnSlideToIndex,
    turnSlideToId,
    execPrev,
    execNext,
    animationIndex,
    restoreAnimationState,
    laserPen,
    broadcastExit,
  }
}
