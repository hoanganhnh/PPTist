/**
 * FSDS integration barrel export.
 * All FSDS-specific adapter code lives under src/integrations/fsds/
 * to isolate it from PPTist core for upstream mergeability.
 */

export {
  isFsdsMode,
  getDeckIdFromUrl,
  initBridge,
  destroyBridge,
  waitForBootstrap,
  registerSaveHandler,
  sendSaved,
  sendSaveFailed,
  sendError,
  sendNavigateBack,
} from './parent-bridge'

export {
  initFsdsApi,
  loadDeck,
  loadResource,
  saveDeck,
} from './fsds-api'

export {
  hasValidSlides,
  mapResponseToStore,
  mapStoreToSavePayload,
} from './deck-mapper'

export {
  initSession,
  getSession,
  updateDeckVersion,
  refreshSession,
  destroySession,
} from './editor-session'

export {
  setBaseline,
  startDirtyTracking,
  stopDirtyTracking,
  getIsDirty,
} from './dirty-tracker'
