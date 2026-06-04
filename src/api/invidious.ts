// api/invidious.ts
import axios, { AxiosError } from 'axios'

const defaultInstances = [
  'https://script.google.com/macros/s/AKfycbxi9iAARiDYyZPoTqy-1p3h-e7W1x7Ct1epdCtmga8UHLptrnz_77adiqbVCcLnKYLG/exec'
]

function getInstances() {
  const customEndpoint =
    localStorage.getItem('custom_endpoint')

  const endpointMode =
    localStorage.getItem('endpoint_mode') || 'default'

  if (
    endpointMode === 'custom' &&
    customEndpoint
  ) {
    return [customEndpoint]
  }

  if (
    endpointMode === 'rotation' &&
    customEndpoint
  ) {
    return [
      ...defaultInstances,
      customEndpoint
    ]
  }

  return defaultInstances
}

async function request(path: string) {
  const cleanPath = path.startsWith('/')
    ? path
    : `/${path}`

  const instances = getInstances()

  for (const instance of instances) {
    const maxRetries = 3 // 最大試行回数 (初回含む)
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const targetUrl = new URL(instance)
        const isSubQuery = cleanPath.includes('?')

        if (isSubQuery) {
          const [apiPath, searchParams] = cleanPath.split('?')

          targetUrl.searchParams.set('path', apiPath)

          const params = new URLSearchParams(searchParams)

          params.forEach((value, key) => {
            targetUrl.searchParams.set(key, value)
          })
        } else {
          targetUrl.searchParams.set('path', cleanPath)
        }

        const res = await axios.get(
          targetUrl.toString(),
          {
            timeout: 5000
          }
        )

        return res.data
      } catch (e) {
        const error = e as AxiosError
        const status = error.response?.status

        // 再試行（再接続）すべきかどうかの判定項目:
        // - ネットワークエラーやタイムアウト (error.response がない)
        // - 401 Unauthorized / 403 Forbidden (セッション切れ・認証エラー)
        // - 408 Request Timeout (タイムアウト)
        // - 429 Too Many Requests (レートリミット)
        // - 5xx Server Errors (サーバーの一時的な不具合)
        const shouldRetry = !status || 
          status === 401 || 
          status === 403 || 
          status === 408 || 
          status === 429 || 
          status >= 500

        if (shouldRetry && attempt < maxRetries) {
          console.warn(
            `Connection issue (Attempt ${attempt}/${maxRetries}). Retrying...: ${instance}${cleanPath} | Reason: ${error.message}`
          )
          // 次のループ（再試行）に進む前に、わずかな待機時間を挟む（1秒）
          await new Promise((resolve) => setTimeout(resolve, 1000))
          continue
        }

        console.warn(
          `Instance failed after max retries: ${instance}${cleanPath} | Reason: ${error.message}`
        )
        break // このインスタンスでの試行を諦め、次のインスタンスへ
      }
    }
  }

  throw new Error('All instances failed to respond.')
}

export async function searchVideos(query: string) {
  return request(
    `/api/v1/search?q=${encodeURIComponent(query)}&type=video`
  )
}

export async function trendingVideos() {
  return request('/api/v1/trending')
}

export async function getVideo(id: string) {
  return request(`/api/v1/videos/${id}`)
}

export async function getComments(id: string) {
  return request(`/api/v1/comments/${id}`)
}

export async function getPopularVideos() {
  return request('/api/v1/popular')
}

export async function getChannel(channelId: string) {
  return request(`/api/v1/channels/${channelId}`)
}

export async function getChannelVideos(channelId: string) {
  return request(`/api/v1/channels/videos/${channelId}`)
}

export async function getPlaylist(playlistId: string) {
  return request(`/api/v1/playlists/${playlistId}`)
}
