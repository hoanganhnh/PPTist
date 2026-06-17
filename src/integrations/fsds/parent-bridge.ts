/**
 * FSDS ↔ PPTist postMessage bridge.
 * Handles communication between the PPTist iframe (child) and
 * the FSDS parent page. Validates origins for security.
 *
 * All events follow the contract in architecture-contract.md §4.
 */

// ── Event Types ──

export const EVENTS = {
  // Child → Parent
  READY: 'SLIDES_EDITOR_READY',
  DIRTY: 'SLIDES_EDITOR_DIRTY',
  SAVED: 'SLIDES_EDITOR_SAVED',
  SAVE_FAILED: 'SLIDES_EDITOR_SAVE_FAILED',
  ERROR: 'SLIDES_EDITOR_ERROR',
  NAVIGATE_BACK: 'SLIDES_EDITOR_NAVIGATE_BACK',
  TOKEN_REFRESH: 'SLIDES_EDITOR_TOKEN_REFRESH',
  UPLOAD_PROGRESS: 'SLIDES_EDITOR_UPLOAD_PROGRESS',

  // Parent → Child
  BOOTSTRAP: 'SLIDES_EDITOR_BOOTSTRAP',
  SAVE_REQUEST: 'SLIDES_EDITOR_SAVE_REQUEST',
} as const

// ── Payload Types ──

export interface BootstrapPayload {
  apiBaseUrl: string
  deckId: string
  editorToken: string
  editorTokenExpiresAt: string
  credentialMode: 'bearer-token'
  parentOrigin: string
}

export interface SavedPayload {
  deckId: string
  version: number
  savedAt: string
}

export interface ErrorPayload {
  code: string
  message: string
}

// ── Bridge State ──

let parentOrigin: string | null = null
let bootstrapResolver: ((payload: BootstrapPayload) => void) | null = null

/** Registered save handler — set via `registerSaveHandler()`. */
let saveHandler: (() => Promise<void>) | null = null

/** Single-flight guard — prevents concurrent save operations. */
let isSaving = false

/**
 * Send a typed message to the parent window.
 * Silently drops the message if no parent origin has been established.
 */
function postToParent(type: string, payload: Record<string, unknown> = {}): void {
  if (!parentOrigin || !window.parent || window.parent === window) return
  window.parent.postMessage(JSON.stringify({ type, payload }), parentOrigin)
}

/**
 * Validate that the event origin is allowed.
 * In production (same-origin), only window.location.origin is accepted.
 * In dev, also allows VITE_ALLOWED_PARENT_ORIGINS.
 */
function isAllowedOrigin(origin: string): boolean {
  if (origin === window.location.origin) return true

  const allowed = import.meta.env.VITE_ALLOWED_PARENT_ORIGINS || ''
  const origins = allowed
    .split(',')
    .map((o: string) => o.trim())
    .filter(Boolean)

  for (const pattern of origins) {
    if (pattern.startsWith('https://*.')) {
      const suffix = pattern.replace('https://*.', '.')
      if (origin.endsWith(suffix) || origin === `https://${suffix.slice(1)}`) return true
    }
    else if (origin === pattern || origin === `https://${pattern}`) {
      return true
    }
  }
  return false
}

/**
 * Handle incoming messages from the parent.
 */
function handleParentMessage(event: MessageEvent): void {
  if (!isAllowedOrigin(event.origin)) return

  let data: { type: string; payload: unknown }
  try {
    data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
  }
  catch {
    return
  }

  switch (data.type) {
    case EVENTS.BOOTSTRAP: {
      if (!bootstrapResolver) break
      parentOrigin = event.origin
      const payload = data.payload as BootstrapPayload
      // Override parentOrigin from bootstrap if provided
      if (payload.parentOrigin) parentOrigin = payload.parentOrigin
      bootstrapResolver(payload)
      bootstrapResolver = null
      break
    }

    case EVENTS.SAVE_REQUEST: {
      // Parent requested a save — invoke registered handler with single-flight guard
      if (!saveHandler || isSaving) break
      isSaving = true
      saveHandler()
        .finally(() => {
          isSaving = false
        })
      break
    }

    default:
      break
  }
}

// ── Public API ──

/**
 * Initialize the bridge listener. Call once on app mount.
 */
export function initBridge(): void {
  window.addEventListener('message', handleParentMessage)
}

/**
 * Destroy the bridge listener. Call on app unmount.
 */
export function destroyBridge(): void {
  window.removeEventListener('message', handleParentMessage)
}

/**
 * Register a save handler to be invoked when the parent sends SAVE_REQUEST.
 * The handler should perform the full save cycle and emit SAVED/SAVE_FAILED.
 * Returns an unregister function.
 */
export function registerSaveHandler(handler: () => Promise<void>): () => void {
  saveHandler = handler
  return () => {
    saveHandler = null
  }
}

/**
 * Send READY event and wait for BOOTSTRAP response.
 * Returns the bootstrap payload with API URL, token, etc.
 */
export function waitForBootstrap(deckId: string): Promise<BootstrapPayload> {
  return new Promise((resolve) => {
    bootstrapResolver = resolve

    // In FSDS mode, try to determine parent origin for the READY message
    // For same-origin deployment, window.location.origin works.
    // For dev, use '*' for the initial READY (parent validates deckId).
    const readyOrigin = window.parent !== window ? '*' : window.location.origin

    window.parent.postMessage(
      JSON.stringify({
        type: EVENTS.READY,
        payload: { deckId, version: '1.0.0' },
      }),
      readyOrigin,
    )
  })
}

/**
 * Notify parent of dirty state change.
 */
export function sendDirty(dirty: boolean): void {
  postToParent(EVENTS.DIRTY, { dirty })
}

/**
 * Notify parent that save succeeded.
 */
export function sendSaved(deckId: string, version: number, savedAt: string): void {
  postToParent(EVENTS.SAVED, { deckId, version, savedAt })
}

/**
 * Notify parent that save failed.
 */
export function sendSaveFailed(deckId: string, code: string, message: string): void {
  postToParent(EVENTS.SAVE_FAILED, { deckId, code, message })
}

/**
 * Notify parent of an error.
 */
export function sendError(code: string, message: string): void {
  postToParent(EVENTS.ERROR, { code, message })
}

/**
 * Notify parent that user wants to navigate back.
 */
export function sendNavigateBack(deckId: string): void {
  postToParent(EVENTS.NAVIGATE_BACK, { deckId })
}

/**
 * Request token refresh from parent.
 */
export function sendTokenRefresh(deckId: string): void {
  postToParent(EVENTS.TOKEN_REFRESH, { deckId })
}

/**
 * Report upload progress to parent during asset normalization.
 */
export function sendUploadProgress(uploaded: number, total: number): void {
  postToParent(EVENTS.UPLOAD_PROGRESS, { uploaded, total })
}

/**
 * Check if running in FSDS iframe mode.
 */
export function isFsdsMode(): boolean {
  return import.meta.env.VITE_FSDS_MODE === 'true'
    || new URLSearchParams(window.location.search).has('deckId')
}

/**
 * Get deckId from URL params.
 */
export function getDeckIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('deckId')
}
