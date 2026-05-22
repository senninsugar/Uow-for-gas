<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import Layout from '../components/layout/Layout.vue'
import VideoGrid from '../components/video/VideoGrid.vue'

import { searchVideos } from '../api/invidious'

const route = useRoute()
const videos = ref<any[]>([])

onMounted(async () => {
  const q = route.query.search_query as string
  videos.value = await searchVideos(q)
})
</script>

<template>
  <Layout>
    <VideoGrid :videos="videos" />
  </Layout>
</template>
