/**
 * Editor session state management for the FSDS iframe.
 * Tracks the bootstrap payload, current deck version, and handles
 * token refresh timing.
 */

import { type BootstrapPayload, sendTokenRefresh } from './parent-bridge'
import { updateEditorToken } from './fsds-api'

/** Token refresh buffer — request refresh 5 minutes before expiry */
const REFRESH_BUFFER_MS = 5 * 60 * 1000

export interface EditorSessionState {
  deckId: string
  tenantId: string
  apiBaseUrl: string
  editorToken: string
  editorTokenExpiresAt: string
  parentOrigin: string
  /** Current deck version for optimistic concurrency */
  deckVersion: number
}

let sessionState: EditorSessionState | null = null
let refreshTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Initialize session state from the bootstrap payload.
 */
export function initSession(bootstrap: BootstrapPayload): EditorSessionState {
  sessionState = {
    deckId: bootstrap.deckId,
    tenantId: '',
    apiBaseUrl: bootstrap.apiBaseUrl,
    editorToken: bootstrap.editorToken,
    editorTokenExpiresAt: bootstrap.editorTokenExpiresAt,
    parentOrigin: bootstrap.parentOrigin,
    deckVersion: 0, // Will be set after deck load
  }

  scheduleTokenRefresh()
  return sessionState
}

/**
 * Get the current session state. Throws if not initialized.
 */
export function getSession(): EditorSessionState {
  if (!sessionState) throw new Error('Editor session not initialized')
  return sessionState
}

/**
 * Update the deck version after a successful load or save.
 */
export function updateDeckVersion(version: number): void {
  if (sessionState) sessionState.deckVersion = version
}

/**
 * Handle a new bootstrap payload (e.g. after token refresh).
 */
export function refreshSession(bootstrap: BootstrapPayload): void {
  if (!sessionState) return

  sessionState.editorToken = bootstrap.editorToken
  sessionState.editorTokenExpiresAt = bootstrap.editorTokenExpiresAt

  updateEditorToken(bootstrap.editorToken)
  scheduleTokenRefresh()
}

/**
 * Schedule a token refresh request 5 minutes before token expiry.
 */
function scheduleTokenRefresh(): void {
  if (refreshTimer) clearTimeout(refreshTimer)
  if (!sessionState) return

  const expiresAt = new Date(sessionState.editorTokenExpiresAt).getTime()
  const now = Date.now()
  const delay = expiresAt - now - REFRESH_BUFFER_MS

  if (delay <= 0) {
    // Token already near expiry — request refresh immediately
    sendTokenRefresh(sessionState.deckId)
    return
  }

  refreshTimer = setTimeout(() => {
    if (sessionState) {
      sendTokenRefresh(sessionState.deckId)
    }
  }, delay)
}

/**
 * Clean up session state and timers.
 */
export function destroySession(): void {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
  sessionState = null
}
