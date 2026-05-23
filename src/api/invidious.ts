// api/invidious.ts
import axios, { AxiosError } from 'axios'

const instances = [
  'https://uow-bakend12.vercel.app'
]

async function request(path: string) {
  const cleanPath = path.startsWith('/')
    ? path
    : `/${path}`

  for (const instance of instances) {
    try {
      const res = await axios.get(
        `${instance}${cleanPath}`,
        {
          timeout: 5000
        }
      )

      return res.data
    } catch (e) {
      const error = e as AxiosError

      console.warn(
        `Instance failed: ${instance}${cleanPath} | Reason: ${error.message}`
      )
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
