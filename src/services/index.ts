import axios from './axios'
import fetchRequest from './fetch'
import { isFsdsMode } from '@/integrations/fsds/parent-bridge'

// export const SERVER_URL = 'http://localhost:5000'
// In FSDS mode, disable all PPTist public server calls (image search, AI PPT, AI writing)
export const SERVER_URL = isFsdsMode()
  ? ''
  : (import.meta.env.MODE === 'development') ? '/api' : 'https://server.pptist.cn'

interface ImageSearchPayload {
  query: string;
  orientation?: 'landscape' | 'portrait' | 'square' | 'all';
  locale?: 'zh' | 'en';
  order?: 'popular' | 'latest';
  size?: 'large' | 'medium' | 'small';
  image_type?: 'all' | 'photo' | 'illustration' | 'vector';
  page?: number;
  per_page?: number;
}

interface AIPPTOutlinePayload {
  content: string
  language: string
  model: string
}

interface AIPPTPayload {
  content: string
  language: string
  style: string
  model: string
}

interface AIWritingPayload {
  content: string
  command: string
}

const getMockData = (filename: string): Promise<any> => {
  return axios.get(`./mocks/${filename}.json`)
}

export default {
  getMockData,

  searchImage(body: ImageSearchPayload): Promise<any> {
    const fetchMock = () => {
      return getMockData('imgs').then((mockImgs: any[]) => {
        let filtered = mockImgs
        if (body.query && body.query.toLowerCase() !== 'landscape') {
          const queryLower = body.query.toLowerCase()
          filtered = mockImgs.filter(img => img.src.toLowerCase().includes(queryLower))
          if (filtered.length === 0) {
            filtered = mockImgs
          }
        }
        
        const page = body.page || 1
        const perPage = body.per_page || 50
        const start = (page - 1) * perPage
        const end = start + perPage
        const sliced = filtered.slice(start, end)
        
        return {
          data: sliced,
          total: filtered.length
        }
      })
    }

    if (isFsdsMode() || !SERVER_URL) {
      return fetchMock()
    }

    return axios.post(`${SERVER_URL}/tools/img_search`, body).catch(() => {
      return fetchMock()
    })
  },

  AIPPT_Outline({
    content,
    language,
    model,
  }: AIPPTOutlinePayload): Promise<any> {
    return fetchRequest(`${SERVER_URL}/tools/aippt_outline`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        language,
        model,
        stream: true,
      }),
    })
  },

  AIPPT({
    content,
    language,
    style,
    model,
  }: AIPPTPayload): Promise<any> {
    return fetchRequest(`${SERVER_URL}/tools/aippt`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        language,
        model,
        style,
        stream: true,
      }),
    })
  },

  AI_Writing({
    content,
    command,
  }: AIWritingPayload): Promise<any> {
    return fetchRequest(`${SERVER_URL}/tools/ai_writing`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        command,
        model: 'glm-4.7-flash',
        stream: true,
      }),
    })
  },
}