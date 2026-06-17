/**
 * Save error classifier for the FSDS PPTist integration.
 *
 * Maps raw save/upload errors to user-friendly messages using
 * stable backend error codes. Falls back to HTTP status when
 * no code is present (e.g. parser-level 413).
 *
 * Architecture contract: codes are allowlisted here so the UI
 * never accidentally exposes raw backend internals.
 */

import type { AxiosError } from 'axios'
import type { AssetUploadError } from './asset-normalizer'

// ── Stable error codes → friendly messages ──

const FRIENDLY_MESSAGES: Record<string, string> = {
  SLIDES_DECK_TOO_LARGE:
    'This presentation is too large to save because some images are still embedded. Upload images separately, then try again.',
  SLIDES_TOO_MANY_SLIDES:
    'This presentation has more than 200 slides. Remove slides before saving.',
  SLIDES_PAYLOAD_TOO_LARGE:
    'This presentation is too large to send. Save could not continue.',
  SLIDES_ASSET_QUOTA_EXCEEDED:
    'This presentation has reached the image storage limit. Remove unused images or reduce image size.',
  ASSET_UPLOAD_FAILED:
    'Some slide images could not upload. Check your connection and retry Save.',
  ASSET_TYPE_UNSUPPORTED:
    'One or more images use an unsupported format. Use PNG, JPG, WebP, or GIF.',
  VERSION_CONFLICT:
    'Someone else saved this presentation. Reload the page to get the latest version.',
}

// ── Default fallback messages by HTTP status ──

const STATUS_FALLBACKS: Record<number, { code: string; message: string }> = {
  413: {
    code: 'SLIDES_PAYLOAD_TOO_LARGE',
    message: FRIENDLY_MESSAGES.SLIDES_PAYLOAD_TOO_LARGE,
  },
  409: {
    code: 'VERSION_CONFLICT',
    message: FRIENDLY_MESSAGES.VERSION_CONFLICT,
  },
}

export interface ClassifiedError {
  /** Stable error code for logging/telemetry */
  code: string
  /** User-facing message (no raw backend detail) */
  message: string
}

/**
 * Classify a save error into a stable code + friendly message.
 *
 * Priority:
 * 1. AssetUploadError — uses its own code
 * 2. Backend response body `code` field (stable error codes from service)
 * 3. HTTP status fallback (e.g. parser-level 413 that bypasses NestJS)
 * 4. Generic fallback
 */
export function classifySaveError(error: unknown): ClassifiedError {
  // 1. AssetUploadError from normalization
  if (isAssetUploadError(error)) {
    const code = error.code || 'ASSET_UPLOAD_FAILED'
    return {
      code,
      message: FRIENDLY_MESSAGES[code] || error.message,
    }
  }

  // 2. Axios error with a backend response
  if (isAxiosError(error) && error.response) {
    const responseData = error.response.data as Record<string, unknown> | undefined
    const backendCode = responseData?.code as string | undefined

    // Prefer stable code from backend response body
    if (backendCode && FRIENDLY_MESSAGES[backendCode]) {
      return {
        code: backendCode,
        message: FRIENDLY_MESSAGES[backendCode],
      }
    }

    // Fall back to HTTP status
    const statusFallback = STATUS_FALLBACKS[error.response.status]
    if (statusFallback) {
      return statusFallback
    }
  }

  // 3. Generic Error with known code property
  if (error instanceof Error && 'code' in error) {
    const code = (error as Error & { code?: string }).code
    if (code && FRIENDLY_MESSAGES[code]) {
      return { code, message: FRIENDLY_MESSAGES[code] }
    }
  }

  // 4. Generic fallback — don't leak raw messages
  return {
    code: 'SAVE_ERROR',
    message: 'Save failed. Please check your connection and try again.',
  }
}

// ── Type guards ──

function isAssetUploadError(error: unknown): error is AssetUploadError {
  return (
    error instanceof Error
    && error.name === 'AssetUploadError'
    && 'code' in error
  )
}

function isAxiosError(error: unknown): error is AxiosError {
  return (
    error instanceof Error
    && 'isAxiosError' in error
    && (error as AxiosError).isAxiosError === true
  )
}
