<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Layout from '../components/layout/Layout.vue'

const historyVideos = ref<any[]>([])

function loadHistory() {
  historyVideos.value = JSON.parse(
    localStorage.getItem('watch-history') || '[]'
  )
}

function clearHistory() {
  localStorage.removeItem('watch-history')

  historyVideos.value = []
}

onMounted(() => {
  loadHistory()
})
</script>

<template>
  <Layout>
    <div class="bg-white text-black min-h-screen">
      <div class="max-w-[1700px] mx-auto p-6">

        <div class="flex items-center justify-between mb-8">

          <h1 class="text-3xl font-bold">
            再生履歴
          </h1>

          <button
            v-if="historyVideos.length"
            class="bg-black text-white px-5 h-10 rounded-full font-semibold hover:bg-zinc-800 transition"
            @click="clearHistory"
          >
            履歴を削除
          </button>

        </div>

        <div
          v-if="historyVideos.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >

          <RouterLink
            v-for="video in historyVideos"
            :key="video.videoId"
            :to="`/watch/${video.videoId}`"
            class="group"
          >

            <img
              :src="video.thumbnail"
              class="w-full aspect-video object-cover rounded-2xl"
            >

            <div
              class="mt-3 font-semibold text-[15px] leading-6 line-clamp-2 group-hover:text-zinc-700"
            >
              {{ video.title }}
            </div>

          </RouterLink>

        </div>

        <div
          v-else
          class="text-zinc-500 text-lg"
        >
          再生履歴がありません
        </div>

      </div>
    </div>
  </Layout>
</template>
