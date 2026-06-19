/**
 * Maps between FSDS deck API responses and PPTist Pinia store state.
 * Keeps the mapping logic isolated from both the API client and store internals.
 */

import type { Slide, SlideTheme } from '@/types/slides'
import type { FsdsDeckResponse } from './fsds-api'

export interface HydratedDeckState {
  title: string
  theme: Partial<SlideTheme>
  slides: Slide[]
  viewportSize?: number
  viewportRatio?: number
  version: number
}

function createBlankSlide(): Slide {
  return {
    id: 'slide-1',
    elements: [],
  }
}

export function hasValidSlides(slides: Record<string, unknown>[] | undefined): boolean {
  return !!slides?.length && slides.every(slide => {
    return slide
      && !Array.isArray(slide)
      && typeof slide.id === 'string'
      && Array.isArray(slide.elements)
  })
}

function normalizeSlides(slides: Record<string, unknown>[] | undefined): Slide[] {
  if (!hasValidSlides(slides)) return [createBlankSlide()]
  return slides as unknown as Slide[]
}

/**
 * Map an FSDS deck API response into PPTist store-ready state.
 * The deck.data.slides array is treated as opaque PPTist Slide objects.
 */
export function mapResponseToStore(deck: FsdsDeckResponse): HydratedDeckState {
  const { data } = deck
  return {
    title: data.title || deck.title || 'Untitled Presentation',
    theme: (data.theme || {}) as Partial<SlideTheme>,
    slides: normalizeSlides(data.slides),
    viewportSize: data.viewportSize,
    viewportRatio: data.viewportRatio,
    version: deck.version,
  }
}

/**
 * Serialize the current PPTist store state into an FSDS save payload.
 */
export function mapStoreToSavePayload(
  title: string,
  theme: SlideTheme,
  slides: Slide[],
  viewportSize: number,
  viewportRatio: number,
  version: number,
): { title: string; data: Record<string, unknown>; version: number } {
  return {
    title,
    data: {
      title,
      width: 1920,
      height: 1080,
      theme,
      slides,
      viewportSize,
      viewportRatio,
    },
    version,
  }
}

/**
 * Convert a payload containing Vue/Pinia reactive proxies into plain JSON.
 * The backend contract is JSON, so this also matches the API wire format.
 */
export function createSerializableDeckSnapshot(
  payload: ReturnType<typeof mapStoreToSavePayload>,
): ReturnType<typeof mapStoreToSavePayload> {
  return JSON.parse(JSON.stringify(payload)) as ReturnType<typeof mapStoreToSavePayload>
}
