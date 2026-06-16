/**
 * Dirty state tracker for the FSDS-integrated PPTist editor.
 * Compares a serialized baseline (set after hydration/save) against
 * the current Pinia slides store state to determine if unsaved changes exist.
 *
 * Reports dirty state changes to the parent via postMessage.
 */

import { watch, ref, type Ref } from 'vue'
import { useSlidesStore } from '@/store'
import { sendDirty } from './parent-bridge'

let baseline: string = ''
const isDirty: Ref<boolean> = ref(false)
let stopWatcher: (() => void) | null = null

/**
 * Serialize the relevant store state for comparison.
 * Only includes fields that represent "document content" — not UI state.
 */
function serializeState(store: ReturnType<typeof useSlidesStore>): string {
  return JSON.stringify({
    title: store.title,
    theme: store.theme,
    slides: store.slides,
    viewportSize: store.viewportSize,
    viewportRatio: store.viewportRatio,
  })
}

/**
 * Set the current store state as the clean baseline.
 * Call after initial hydration and after each successful save.
 */
export function setBaseline(): void {
  const store = useSlidesStore()
  baseline = serializeState(store)
  isDirty.value = false
  sendDirty(false)
}

/**
 * Start watching the slides store for dirty state changes.
 * Uses a deep watcher on the reactive store state.
 */
export function startDirtyTracking(): void {
  if (stopWatcher) return

  const store = useSlidesStore()

  stopWatcher = watch(
    () => serializeState(store),
    (newState) => {
      const nowDirty = newState !== baseline
      if (nowDirty !== isDirty.value) {
        isDirty.value = nowDirty
        sendDirty(nowDirty)
      }
    },
    { deep: false }, // serializeState already deep-serializes
  )
}

/**
 * Stop the dirty state watcher.
 */
export function stopDirtyTracking(): void {
  if (stopWatcher) {
    stopWatcher()
    stopWatcher = null
  }
}

/**
 * Check if the editor currently has unsaved changes.
 */
export function getIsDirty(): boolean {
  return isDirty.value
}
