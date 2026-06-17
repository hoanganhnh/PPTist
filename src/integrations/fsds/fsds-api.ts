/**
 * FSDS API client for the PPTist iframe.
 * Uses the bootstrap-provided apiBaseUrl and editorToken (bearer auth).
 * Never resolves tenant URLs — that logic stays in the FSDS React layer.
 */

import axios, { type AxiosInstance } from 'axios'

/** Deck response from GET /slides/:id */
export interface FsdsDeckResponse {
  id: string
  title: string
  ownerType: string
  ownerId: string
  data: Partial<{
    title: string
    width: number
    height: number
    theme: Record<string, unknown>
    slides: Record<string, unknown>[]
    viewportSize?: number
    viewportRatio?: number
  }>
  version: number
  createdAt: string
  updatedAt: string
}

/** Resource detail response from GET /resource/:uuid */
export interface FsdsResourceResponse {
  uuid: string
  fileName: string
  url: string
  uuidCopy?: string
}

/** Save response from PATCH /slides/:id */
export interface FsdsSaveResponse {
  id: string
  title: string
  version: number
  updatedAt: string
}

let client: AxiosInstance | null = null
let currentToken: string | null = null

/**
 * Initialize the FSDS API client with bootstrap credentials.
 */
export function initFsdsApi(apiBaseUrl: string, editorToken: string): void {
  currentToken = editorToken

  client = axios.create({
    baseURL: apiBaseUrl,
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Attach bearer token to every request
  client.interceptors.request.use((config) => {
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`
    }
    return config
  })
}

/**
 * Update the editor token (after refresh from parent).
 */
export function updateEditorToken(newToken: string): void {
  currentToken = newToken
}

/**
 * Load a slide deck from the FSDS backend.
 */
export async function loadDeck(deckId: string): Promise<FsdsDeckResponse> {
  if (!client) throw new Error('FSDS API client not initialized')
  const { data } = await client.get<FsdsDeckResponse>(`/slides/${deckId}`)
  return data
}

/**
 * Load a resource detail with a signed URL for the original PPTX file.
 */
export async function loadResource(resourceUuid: string): Promise<FsdsResourceResponse> {
  if (!client) throw new Error('FSDS API client not initialized')
  const { data } = await client.get<FsdsResourceResponse>(`/resource/${resourceUuid}`)
  return data
}

/**
 * Save (update) a slide deck to the FSDS backend.
 * Uses optimistic concurrency via the version field.
 */
export async function saveDeck(
  deckId: string,
  payload: {
    title?: string
    data?: Record<string, unknown>
    version: number
  },
): Promise<FsdsSaveResponse> {
  if (!client) throw new Error('FSDS API client not initialized')
  const { data } = await client.patch<FsdsSaveResponse>(
    `/slides/${deckId}`,
    payload,
  )
  return data
}

/** Asset upload response from POST /slides/:id/assets */
export interface FsdsAssetResponse {
  url: string
  key: string
  checksum: string
  mimeType: string
  size: number
  status: 'staged' | 'referenced'
}

/**
 * Upload a single image asset for a slide deck.
 * Uses a longer timeout than JSON requests since uploads can be slow.
 */
export async function uploadDeckAsset(
  deckId: string,
  file: File,
): Promise<FsdsAssetResponse> {
  if (!client) throw new Error('FSDS API client not initialized')
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await client.post<FsdsAssetResponse>(
    `/slides/${deckId}/assets`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120_000,
    },
  )
  return data
}
