<!-- components/video/VideoPlayer.vue -->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: string
  stream?: string
  formatStreams?: any[]
}>()

const selectedVideo = computed(() => {
  if (!props.formatStreams?.length) {
    return null
  }

  return (
    props.formatStreams.find(
      (stream) =>
        stream.qualityLabel === '720p'
    ) ||
    props.formatStreams.find(
      (stream) =>
        stream.qualityLabel === '480p'
    ) ||
    props.formatStreams[0]
  )
})
</script>

<template>
  <div
    class="w-full aspect-video rounded-2xl border border-zinc-200 overflow-hidden bg-black"
  >
    <video
      v-if="selectedVideo"
      class="w-full h-full"
      controls
      autoplay
      playsinline
    >
      <source
        :src="selectedVideo.url"
        :type="selectedVideo.type"
      >
    </video>

    <iframe
      v-else
      class="w-full h-full"
      :src="
        stream === 'youtube'
          ? `https://www.youtube.com/embed/${id}`
          : `https://www.youtube-nocookie.com/embed/${id}`
      "
      allowfullscreen
    />
  </div>
</template>
