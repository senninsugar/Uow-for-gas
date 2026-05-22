<script setup lang="ts">
import VideoCard from './VideoCard.vue'

defineProps<{
  videos: any[]
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
    <VideoCard
      v-for="video in videos"
      :key="video.videoId"
      :video="video"
    />
  </div>
</template>
