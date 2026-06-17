/**
 * Asset normalizer for FSDS PPTist save flow.
 *
 * Scans deck payload for base64 image data URLs, uploads them to the
 * slides asset endpoint, and replaces embedded data with returned URLs.
 *
 * Key invariants (RT-S2):
 * - Operates on a structuredClone snapshot — NEVER mutates the live Pinia store.
 * - Store patches are returned and applied ONLY after successful PATCH.
 * - Checksum cache persists across the editor session for retry efficiency.
 */

import { uploadDeckAsset, type FsdsAssetResponse } from './fsds-api'
import { sendUploadProgress } from './parent-bridge'

// ── Types ──

export interface AssetPatch {
  /** JSON path segments to the replaced field (e.g., ['slides', 0, 'elements', 2, 'src']) */
  path: (string | number)[]
  /** The new URL value that replaced the base64 data */
  url: string
}

export interface NormalizationResult {
  /** The payload with base64 replaced by URLs — safe to send to PATCH */
  payload: { title: string; data: Record<string, unknown>; version: number }
  /** Store patches to apply after PATCH success */
  assetPatches: AssetPatch[]
  /** Number of unique images uploaded */
  uploadCount: number
  /** Number of base64 images deduplicated (already in cache) */
  dedupeCount: number
}

// ── Data URL parsing ──

const DATA_URL_RE = /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/

export interface ParsedDataUrl {
  mimeType: string
  extension: string
  bytes: Uint8Array
}

const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

/**
 * Parse a base64 image data URL into its components.
 * Returns null if the value is not a valid image data URL.
 */
export function parseImageDataUrl(value: string): ParsedDataUrl | null {
  const match = value.match(DATA_URL_RE)
  if (!match) return null

  const subtype = match[1]
  const mimeType = `image/${subtype}`

  // Reject SVG
  if (subtype === 'svg+xml') {
    return null // Handled separately — caller checks isSvgDataUrl
  }

  const extension = MIME_TO_EXT[mimeType]
  if (!extension) return null

  const base64Start = value.indexOf(',') + 1
  const base64Data = value.slice(base64Start)
  try {
    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return { mimeType, extension, bytes }
  }
  catch {
    return null
  }
}

/**
 * Check if a value is an SVG data URL (which should be rejected).
 */
export function isSvgDataUrl(value: string): boolean {
  return typeof value === 'string' && value.startsWith('data:image/svg+xml;base64,')
}

// ── Checksum cache ──

/**
 * Session-level cache mapping content checksums to uploaded asset metadata.
 * Persists across save attempts so retries don't re-upload.
 */
export class AssetChecksumCache {
  private readonly cache = new Map<string, FsdsAssetResponse>()

  get(checksum: string): FsdsAssetResponse | undefined {
    return this.cache.get(checksum)
  }

  set(checksum: string, response: FsdsAssetResponse): void {
    this.cache.set(checksum, response)
  }

  get size(): number {
    return this.cache.size
  }
}

// ── SHA-256 checksum ──

async function sha256(bytes: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── Bounded concurrency ──

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let nextIndex = 0

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const i = nextIndex++
      results[i] = await fn(items[i], i)
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  await Promise.all(workers)
  return results
}

// ── Field scanner ──

interface FoundDataUrl {
  path: (string | number)[]
  value: string
  parsed: ParsedDataUrl
}

/**
 * Scan deck data for base64 image data URLs.
 *
 * Priority scan targets (from PPTist types):
 * 1. PPTImageElement.src — primary image source
 * 2. slide.background.image.src — slide background image
 * 3. PPTVideoElement.poster — video thumbnail
 * 4. PPTShapeElement.pattern — shape fill pattern
 *
 * Also performs a deep-walk safety net to catch any other data URLs.
 */
function scanForDataUrls(
  data: unknown,
  path: (string | number)[] = [],
  found: FoundDataUrl[] = [],
  svgPaths: (string | number)[][] = [],
): { found: FoundDataUrl[]; svgPaths: (string | number)[][] } {
  if (typeof data === 'string') {
    if (isSvgDataUrl(data)) {
      svgPaths.push([...path])
      return { found, svgPaths }
    }
    const parsed = parseImageDataUrl(data)
    if (parsed) {
      found.push({ path: [...path], value: data, parsed })
    }
    return { found, svgPaths }
  }

  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      scanForDataUrls(data[i], [...path, i], found, svgPaths)
    }
    return { found, svgPaths }
  }

  if (data && typeof data === 'object') {
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      scanForDataUrls(value, [...path, key], found, svgPaths)
    }
  }

  return { found, svgPaths }
}

/**
 * Set a value at a JSON path in an object.
 */
function setAtPath(obj: unknown, path: (string | number)[], value: unknown): void {
  let current: unknown = obj
  for (let i = 0; i < path.length - 1; i++) {
    current = (current as Record<string | number, unknown>)[path[i]]
  }
  ;(current as Record<string | number, unknown>)[path[path.length - 1]] = value
}

// ── Retry helper ──

const MAX_RETRIES = 2
const RETRY_BASE_MS = 1000

async function uploadWithRetry(
  deckId: string,
  file: File,
): Promise<FsdsAssetResponse> {
  let lastError: unknown
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await uploadDeckAsset(deckId, file)
    }
    catch (error: unknown) {
      lastError = error
      const status = (error as { response?: { status?: number } })?.response?.status
      // Don't retry client errors except 401 (token may have been refreshed)
      if (status && status >= 400 && status < 500 && status !== 401) {
        throw error
      }
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_BASE_MS * (attempt + 1)))
      }
    }
  }
  throw lastError
}

// ── Main normalizer ──

/** Default upload concurrency */
const UPLOAD_CONCURRENCY = 3

export class AssetUploadError extends Error {
  constructor(message: string, public readonly code: string = 'ASSET_UPLOAD_FAILED') {
    super(message)
    this.name = 'AssetUploadError'
  }
}

/**
 * Normalize deck assets: scan for base64 image data, upload to the asset
 * endpoint, and replace with URLs in the payload copy.
 *
 * @param deckId - The deck being saved
 * @param snapshotPayload - A structuredClone of the save payload (will be mutated)
 * @param cache - Session-level checksum cache for deduplication across retries
 * @returns Normalized payload + store patches to apply after PATCH success
 * @throws AssetUploadError if any upload fails or SVG data URLs are found
 */
export async function normalizeDeckAssets(
  deckId: string,
  snapshotPayload: { title: string; data: Record<string, unknown>; version: number },
  cache: AssetChecksumCache,
): Promise<NormalizationResult> {
  // Scan the payload data for base64 image data URLs
  const { found, svgPaths } = scanForDataUrls(snapshotPayload.data)

  // Fail fast on SVG data URLs
  if (svgPaths.length > 0) {
    throw new AssetUploadError(
      `Found ${svgPaths.length} SVG data URL(s) which are not supported. Remove SVG images and try again.`,
      'ASSET_TYPE_UNSUPPORTED',
    )
  }

  // Nothing to normalize — return as-is
  if (found.length === 0) {
    return {
      payload: snapshotPayload,
      assetPatches: [],
      uploadCount: 0,
      dedupeCount: 0,
    }
  }

  // Deduplicate by content — group items by checksum
  const checksumGroups = new Map<string, { checksum: string; items: FoundDataUrl[]; file: File }>()
  for (const item of found) {
    const checksum = await sha256(item.parsed.bytes)

    if (!checksumGroups.has(checksum)) {
      const file = new File(
        [item.parsed.bytes],
        `image-${checksum.slice(0, 8)}.${item.parsed.extension}`,
        { type: item.parsed.mimeType },
      )
      checksumGroups.set(checksum, { checksum, items: [item], file })
    }
    else {
      checksumGroups.get(checksum)!.items.push(item)
    }
  }

  const uniqueUploads = Array.from(checksumGroups.values())
  let uploadCount = 0
  let dedupeCount = 0
  const assetPatches: AssetPatch[] = []

  // Upload unique images with bounded concurrency
  const total = uniqueUploads.length
  let uploaded = 0
  sendUploadProgress(0, total)

  await mapWithConcurrency(uniqueUploads, UPLOAD_CONCURRENCY, async (group) => {
    let response: FsdsAssetResponse

    // Check cache first
    const cached = cache.get(group.checksum)
    if (cached) {
      response = cached
      dedupeCount++
    }
    else {
      try {
        response = await uploadWithRetry(deckId, group.file)
        cache.set(group.checksum, response)
        uploadCount++
      }
      catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        throw new AssetUploadError(
          `Failed to upload image (${group.file.name}): ${message}`,
          'ASSET_UPLOAD_FAILED',
        )
      }
    }

    // Replace all instances of this checksum's data URL with the asset URL
    for (const item of group.items) {
      setAtPath(snapshotPayload.data, item.path, response.url)
      assetPatches.push({
        path: item.path,
        url: response.url,
      })
    }

    uploaded++
    sendUploadProgress(uploaded, total)
  })

  return {
    payload: snapshotPayload,
    assetPatches,
    uploadCount,
    dedupeCount,
  }
}
