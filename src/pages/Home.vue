<script setup lang="ts">
import { onMounted, ref } from 'vue'

import Layout from '../components/layout/Layout.vue'

import VideoGrid from '../components/video/VideoGrid.vue'

import Loading from '../components/layout/Loading.vue'

const videos = ref<any[]>([])

const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/ajgpw/youtubedata/refs/heads/main/trend-base64.json'
    )

    const data = await res.json()

    videos.value = data.trending.map((video: any) => ({
      videoId: video.id,

      title: video.title,

      author: video.channel,

      authorId: video.channelId,

      published: video.publishedAt,

      videoThumbnails: [
        {
          url: video.thumbnails.standard.url
        }
      ]
    }))
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Layout>

    <Loading v-if="loading" />

    <VideoGrid
      v-else
      :videos="videos"
    />

  </Layout>
</template>
