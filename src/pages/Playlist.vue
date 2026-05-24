<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Layout from '../components/layout/Layout.vue'

const playlists = ref<any[]>([])

function loadPlaylists() {
  playlists.value = JSON.parse(
    localStorage.getItem('playlists') || '[]'
  )
}

function createPlaylist() {
  const name = prompt('プレイリスト名')

  if (!name) return

  const playlist = {
    id: crypto.randomUUID(),
    name,
    videos: [],
    createdAt: Date.now()
  }

  playlists.value.unshift(playlist)

  localStorage.setItem(
    'playlists',
    JSON.stringify(playlists.value)
  )
}

function deletePlaylist(id: string) {
  playlists.value = playlists.value.filter(
    (playlist) => playlist.id !== id
  )

  localStorage.setItem(
    'playlists',
    JSON.stringify(playlists.value)
  )
}

onMounted(() => {
  loadPlaylists()
})
</script>

<template>
  <Layout>
    <div class="bg-white text-black min-h-screen">
      <div class="max-w-[1800px] mx-auto px-6 py-8">

        <div class="flex items-center justify-between mb-10">

          <div>
            <h1 class="text-[32px] font-bold tracking-tight">
              プレイリスト
            </h1>

            <div class="text-zinc-500 mt-2 text-[15px]">
              保存したプレイリスト
            </div>
          </div>

          <button
            class="h-10 px-5 rounded-full bg-black text-white font-semibold hover:bg-zinc-800 transition"
            @click="createPlaylist"
          >
            + 新しいプレイリスト
          </button>

        </div>

        <div
          v-if="playlists.length"
          class="space-y-12"
        >

          <div
            v-for="playlist in playlists"
            :key="playlist.id"
          >

            <div class="flex items-center justify-between mb-5">

              <div>
                <div class="text-2xl font-bold">
                  {{ playlist.name }}
                </div>

                <div class="text-sm text-zinc-500 mt-1">
                  {{ playlist.videos.length }} 本の動画
                </div>
              </div>

              <button
                class="h-9 px-4 rounded-full bg-zinc-100 hover:bg-red-100 hover:text-red-600 transition text-sm font-semibold"
                @click="deletePlaylist(playlist.id)"
              >
                削除
              </button>

            </div>

            <div
              v-if="playlist.videos.length"
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >

              <RouterLink
                v-for="video in playlist.videos"
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

                <div class="text-sm text-zinc-500 mt-1">
                  {{ video.author }}
                </div>

              </RouterLink>

            </div>

            <div
              v-else
              class="text-zinc-500"
            >
              動画がありません
            </div>

          </div>

        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center py-32"
        >

          <div
            class="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center text-4xl"
          >
            📂
          </div>

          <div class="mt-6 text-2xl font-bold">
            プレイリストがありません
          </div>

          <div class="text-zinc-500 mt-3 text-center max-w-md leading-7">
            お気に入りの動画を保存して
            自分だけのプレイリストを作成できます
          </div>

          <button
            class="mt-8 h-11 px-6 rounded-full bg-black text-white font-semibold hover:bg-zinc-800 transition"
            @click="createPlaylist"
          >
            プレイリストを作成
          </button>

        </div>

      </div>
    </div>
  </Layout>
</template>
