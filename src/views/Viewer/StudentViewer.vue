<template>
  <div class="student-viewer" @keydown="handleKeydown" tabindex="0" ref="viewerRef">
    <ScreenSlideList
      :slideWidth="slideWidth"
      :slideHeight="slideHeight"
      :animationIndex="animationIndex"
      :turnSlideToId="turnSlideToId"
      :manualExitFullscreen="manualExitFullscreen"
      @wheel="($event: WheelEvent) => mousewheelListener($event)"
      @touchstart="($event: TouchEvent) => touchStartListener($event)"
      @touchend="($event: TouchEvent) => touchEndListener($event)"
    />

    <SlideThumbnails
      v-if="slideThumbnailModelVisible"
      :turnSlideToIndex="turnSlideToIndex"
      @close="slideThumbnailModelVisible = false"
    />

    <div class="tools-left">
      <i-custom:left class="tool-btn" @click="execPrev()" />
      <i-custom:right class="tool-btn" @click="execNext()" />
    </div>

    <div
      class="tools-right" :class="{ 'visible': rightToolsVisible }"
      @mouseleave="rightToolsVisible = false"
      @mouseenter="rightToolsVisible = true"
    >
      <div class="content">
        <div class="tool-btn page-number" @click="slideThumbnailModelVisible = true">
          Slide {{ slideIndex + 1 }} / {{ slides.length }}
        </div>
        <i-icon-park-outline:off-screen-one class="tool-btn" v-tooltip="'Exit Fullscreen'" v-if="fullscreenState" @click="manualExitFullscreen()" />
        <i-icon-park-outline:full-screen-one class="tool-btn" v-tooltip="'Enter Fullscreen'" v-else @click="enterFullscreen()" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * StudentViewer — read-only slide viewer for enrolled students.
 * Renders slides with keyboard/touch/wheel navigation and fullscreen.
 * No drawing board, laser pointer, timer, presenter view, audience view,
 * autoplay, export, end-show, or any mutable controls.
 */
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { enterFullscreen } from '@/utils/fullscreen'
import useExecPlay from '@/views/Screen/hooks/useExecPlay'
import useSlideSize from '@/views/Screen/hooks/useSlideSize'
import useFullscreen from '@/views/Screen/hooks/useFullscreen'

import ScreenSlideList from '@/views/Screen/ScreenSlideList.vue'
import SlideThumbnails from '@/views/Screen/SlideThumbnails.vue'

const { slides, slideIndex } = storeToRefs(useSlidesStore())

const viewerRef = ref<HTMLDivElement>()

const {
  mousewheelListener,
  touchStartListener,
  touchEndListener,
  turnSlideToIndex,
  turnSlideToId,
  execPrev,
  execNext,
  animationIndex,
} = useExecPlay()

const { slideWidth, slideHeight } = useSlideSize()
const { fullscreenState, manualExitFullscreen } = useFullscreen()

const rightToolsVisible = ref(false)
const slideThumbnailModelVisible = ref(false)

function handleKeydown(e: KeyboardEvent) {
  const key = e.key
  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    e.preventDefault()
    execPrev()
  }
  else if (key === 'ArrowRight' || key === 'ArrowDown' || key === ' ') {
    e.preventDefault()
    execNext()
  }
}

onMounted(() => {
  // Auto-focus the viewer container for keyboard navigation
  viewerRef.value?.focus()
})
</script>

<style lang="scss" scoped>
.student-viewer {
  width: 100%;
  height: 100%;
  outline: none;
  background-color: #1a1a1a;
}

.tools-left {
  position: fixed;
  bottom: 8px;
  left: 8px;
  font-size: 25px;
  color: #666;
  z-index: 10;

  .tool-btn {
    opacity: .15;
    cursor: pointer;
    transition: opacity $transitionDelay;

    &:hover {
      opacity: 1;
    }
    & + .tool-btn {
      margin-left: 8px;
    }
  }
}

.tools-right {
  height: 50px;
  position: fixed;
  bottom: -50px;
  right: 0;
  z-index: 5;
  padding: 8px;
  transition: bottom $transitionDelay;

  &.visible {
    bottom: 0;
  }

  &::after {
    content: '';
    width: 100%;
    height: 50px;
    position: absolute;
    left: 0;
    top: -50px;
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $borderRadius;
    font-size: 20px;
    background-color: #fff;
    color: $textColor;
    padding: 6px 10px;
    box-shadow: 0 2px 12px 0 rgb(56, 56, 56, .2);
    border: 1px solid #e2e6ed;
  }

  .tool-btn {
    cursor: pointer;

    &:hover {
      color: $themeColor;
    }

    & + .tool-btn {
      margin-left: 12px;
    }
  }

  .page-number {
    font-size: 12px;
    padding: 0 10px;
    cursor: pointer;
  }
}
</style>
