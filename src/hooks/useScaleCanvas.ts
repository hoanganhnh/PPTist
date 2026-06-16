import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'

export default () => {
  const mainStore = useMainStore()
  const { canvasPercentage, canvasScale, canvasDragged } = storeToRefs(mainStore)

  const canvasScalePercentage = computed(() => Math.round(canvasScale.value * 100) + '%')

  /**
   * Zoom canvas percentage
   * @param command Zoom command: Zoom In, Zoom Out
   */
  const scaleCanvas = (command: '+' | '-') => {
    let percentage = canvasPercentage.value
    const step = 5
    const max = 200
    const min = 30
    if (command === '+' && percentage <= max) percentage += step
    if (command === '-' && percentage >= min) percentage -= step

    mainStore.setCanvasPercentage(percentage)
  }

  /**
   * Set canvas zoom ratio
   * Instead of setting this value directly, it is dynamically calculated by setting the canvas viewport percentage
   * @param value Target canvas zoom ratio
   */
  const setCanvasScalePercentage = (value: number) => {
    const percentage = Math.round(value / canvasScale.value * canvasPercentage.value) / 100
    mainStore.setCanvasPercentage(percentage)
  }

  /**
   * Reset canvas size and position
   */
  const resetCanvas = () => {
    mainStore.setCanvasPercentage(90)
    if (canvasDragged) mainStore.setCanvasDragged(false)
  }

  return {
    canvasScalePercentage,
    setCanvasScalePercentage,
    scaleCanvas,
    resetCanvas,
  }
}