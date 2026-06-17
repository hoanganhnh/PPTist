<template>
  <template v-if="slides.length">
    <Screen v-if="screening" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
  <FullscreenSpin tip="Initializing data, please wait ..." v-else  loading :mask="false" />
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useScreenStore, useMainStore, useSnapshotStore, useSlidesStore } from '@/store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { deleteDiscardedDB } from '@/utils/database'
import { isPC } from '@/utils/common'
import api from '@/services'
import {
  isFsdsMode,
  getDeckIdFromUrl,
  initBridge,
  destroyBridge,
  waitForBootstrap,
  initFsdsApi,
  loadDeck,
  loadResource,
  saveDeck,
  hasValidSlides,
  mapResponseToStore,
  mapStoreToSavePayload,
  initSession,
  updateDeckVersion,
  sendSaved,
  sendSaveFailed,
  sendError,
  setBaseline,
  startDirtyTracking,
  stopDirtyTracking,
  destroySession,
  registerSaveHandler,
  normalizeDeckAssets,
  AssetChecksumCache,
  classifySaveError,
} from '@/integrations/fsds'
import useImport from '@/hooks/useImport'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'
import Mobile from './views/Mobile/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'

const _isPC = isPC()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const snapshotStore = useSnapshotStore()
const screenStore = useScreenStore()
const { databaseId } = storeToRefs(mainStore)
const { slides } = storeToRefs(slidesStore)
const { screening } = storeToRefs(screenStore)
const { importPPTXFile } = useImport()

const isAudienceMode = new URLSearchParams(window.location.search).get('mode') === 'audience'
const _isFsdsMode = isFsdsMode()

// In FSDS mode, parent owns the navigation warning via dirty events.
// Only set unconditional onbeforeunload for standalone (non-FSDS) production.
if (!_isFsdsMode && import.meta.env.MODE !== 'development') {
  window.onbeforeunload = () => false
}

/**
 * FSDS boot flow:
 * 1. Read deckId from URL
 * 2. Init postMessage bridge
 * 3. Send READY, wait for BOOTSTRAP from parent
 * 4. Init API client with bootstrap credentials
 * 5. Init session state
 * 6. Load deck from FSDS API
 * 7. Hydrate PPTist stores
 * 8. Set dirty baseline and start tracking
 */
async function bootFsds(): Promise<void> {
  const deckId = getDeckIdFromUrl()
  if (!deckId) {
    sendError('NO_DECK_ID', 'No deckId parameter found in URL')
    return
  }

  initBridge()

  try {
    // Wait for parent to send bootstrap data
    const bootstrap = await waitForBootstrap(deckId)

    // Initialize API client with bootstrap credentials
    initFsdsApi(bootstrap.apiBaseUrl, bootstrap.editorToken)

    // Initialize session state
    initSession(bootstrap)

    // Load deck from FSDS backend
    const deckResponse = await loadDeck(deckId)
    const deckState = mapResponseToStore(deckResponse)

    // Hydrate PPTist stores
    slidesStore.setTitle(deckState.title)
    if (Object.keys(deckState.theme).length > 0) {
      slidesStore.setTheme(deckState.theme)
    }
    slidesStore.setSlides(deckState.slides)
    if (deckState.viewportSize) slidesStore.setViewportSize(deckState.viewportSize)
    if (deckState.viewportRatio) slidesStore.setViewportRatio(deckState.viewportRatio)

    // Track deck version for optimistic concurrency
    updateDeckVersion(deckState.version)

    if (shouldImportResourcePptx(deckResponse)) {
      await importResourcePptx(deckResponse.ownerId)
      // RT-S2: Normalize imported PPTX assets before initial save
      const importSnapshot = structuredClone(mapStoreToSavePayload(
        slidesStore.title,
        slidesStore.theme,
        slidesStore.slides,
        slidesStore.viewportSize,
        slidesStore.viewportRatio,
        deckState.version,
      ))
      const { payload, assetPatches } = await normalizeDeckAssets(
        deckId,
        importSnapshot,
        assetChecksumCache,
      )
      const result = await saveDeck(deckId, payload)
      applyNormalizedAssetsToStore(assetPatches)
      updateDeckVersion(result.version)
    }

    await deleteDiscardedDB()
    await snapshotStore.initSnapshotDatabase()

    // Set dirty baseline (current state = clean)
    setBaseline()
    startDirtyTracking()
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    sendError('BOOT_FAILED', `Failed to initialize editor: ${message}`)
  }
}

function shouldImportResourcePptx(deckResponse: Awaited<ReturnType<typeof loadDeck>>): boolean {
  const slides = deckResponse.data?.slides
  return deckResponse.ownerType === 'resource'
    && deckResponse.title.toLowerCase().endsWith('.pptx')
    && !hasValidSlides(slides)
}

async function importResourcePptx(resourceUuid: string): Promise<void> {
  const resource = await loadResource(resourceUuid)
  if (!resource.fileName.toLowerCase().endsWith('.pptx')) {
    throw new Error(`Resource is not a PPTX file: ${resource.fileName}`)
  }

  const response = await fetch(resource.url)
  if (!response.ok) {
    throw new Error(`Failed to download PPTX resource: HTTP ${response.status}`)
  }

  const blob = await response.blob()
  const file = new File([blob], resource.fileName, {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  })
  const imported = await importPPTXFile([file], { cover: true })
  if (!imported) throw new Error(`Failed to import PPTX resource: ${resource.fileName}`)
}

/**
 * Standalone (non-FSDS) boot flow — original PPTist behavior.
 */
async function bootStandalone(): Promise<void> {
  if (isAudienceMode) {
    slidesStore.setSlides([{
      id: nanoid(10),
      elements: [],
    }])
    screenStore.setScreening(true)
  }
  else {
    const slides = await api.getMockData('slides')
    slidesStore.setSlides(slides)

    await deleteDiscardedDB()
    snapshotStore.initSnapshotDatabase()
  }
}

onMounted(async () => {
  if (_isFsdsMode) {
    await bootFsds()
  }
  else {
    await bootStandalone()
  }
})

onBeforeUnmount(() => {
  if (_isFsdsMode) {
    stopDirtyTracking()
    destroySession()
    destroyBridge()
  }
})

// When the app is unloaded, record the current indexedDB database ID
// to localStorage for subsequent database cleanup (standalone mode only)
if (!_isFsdsMode) {
  window.addEventListener('beforeunload', () => {
    const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
    const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

    discardedDBList.push(databaseId.value)

    const newDiscardedDB = JSON.stringify(discardedDBList)
    localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
  })
}

/**
 * Session-level checksum cache — persists across save attempts so retries
 * and version-conflict recoveries don't re-upload already-uploaded images.
 */
const assetChecksumCache = new AssetChecksumCache()

/**
 * Apply normalized asset URLs to the live Pinia store after PATCH success.
 * This ensures setBaseline() snapshot matches the saved payload.
 */
function applyNormalizedAssetsToStore(
  assetPatches: Array<{ path: (string | number)[]; url: string }>,
): void {
  if (assetPatches.length === 0) return

  // The patches contain paths like ['slides', 0, 'elements', 2, 'src']
  // We need to apply them to the live store objects
  for (const patch of assetPatches) {
    const [root, ...rest] = patch.path
    if (root === 'slides' && typeof rest[0] === 'number') {
      const slideIndex = rest[0]
      const slide = slidesStore.slides[slideIndex]
      if (!slide) continue
      // Navigate to the target field in the live slide
      let current: unknown = slide
      for (let i = 1; i < rest.length - 1; i++) {
        current = (current as Record<string | number, unknown>)[rest[i]]
        if (!current) break
      }
      if (current) {
        const lastKey = rest[rest.length - 1]
        ;(current as Record<string | number, unknown>)[lastKey] = patch.url
      }
    }
    else if (root === 'theme') {
      // Theme-level patches (if any)
      let current: unknown = slidesStore.theme
      for (let i = 0; i < rest.length - 1; i++) {
        current = (current as Record<string | number, unknown>)[rest[i]]
        if (!current) break
      }
      if (current) {
        const lastKey = rest[rest.length - 1]
        ;(current as Record<string | number, unknown>)[lastKey] = patch.url
      }
    }
  }
}

/**
 * Save the current deck state to the FSDS backend.
 * Normalizes base64 image data to uploaded asset URLs before PATCH.
 * Store is only mutated after successful PATCH (RT-S2 invariant).
 */
async function handleFsdsSave(): Promise<void> {
  if (!_isFsdsMode) return

  const deckId = getDeckIdFromUrl()
  if (!deckId) return

  const { getSession } = await import('@/integrations/fsds/editor-session')
  const session = getSession()

  // RT-S2: structuredClone snapshot before normalization — live store is NOT mutated
  const snapshot = structuredClone(mapStoreToSavePayload(
    slidesStore.title,
    slidesStore.theme,
    slidesStore.slides,
    slidesStore.viewportSize,
    slidesStore.viewportRatio,
    session.deckVersion,
  ))

  try {
    // Normalize: upload base64 images and replace with URLs in snapshot
    const { payload, assetPatches } = await normalizeDeckAssets(
      deckId,
      snapshot,
      assetChecksumCache,
    )

    // PATCH with normalized payload
    const result = await saveDeck(deckId, payload)

    // RT-S2: Only after PATCH success — apply normalized URLs to live store
    applyNormalizedAssetsToStore(assetPatches)
    updateDeckVersion(result.version)
    setBaseline()
    sendSaved(deckId, result.version, result.updatedAt)
  }
  catch (error: unknown) {
    const { code, message } = classifySaveError(error)
    sendSaveFailed(deckId, code, message)
  }
}

// Expose save function on window for toolbar/debug integration
// Also register with the bridge for parent-triggered saves
let unregisterSaveHandler: (() => void) | undefined
if (_isFsdsMode) {
  (window as unknown as Record<string, unknown>).__fsdsSave = handleFsdsSave
  unregisterSaveHandler = registerSaveHandler(handleFsdsSave)
}

onBeforeUnmount(() => {
  unregisterSaveHandler?.()
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
