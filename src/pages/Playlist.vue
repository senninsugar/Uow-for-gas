<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Layout from '../components/layout/Layout.vue'

const playlists = ref<any[]>([])
const selectedPlaylist = ref<any | null>(null)

const showCreateModal = ref(false)
const newPlaylistName = ref('')

function loadPlaylists() {
  playlists.value = JSON.parse(
    localStorage.getItem('playlists') || '[]'
  )
}

function createPlaylist() {
  if (!newPlaylistName.value.trim()) return

  const playlist = {
    id: crypto.randomUUID(),
    name: newPlaylistName.value,
    videos: [],
    createdAt: Date.now()
  }

  playlists.value.unshift(playlist)

  localStorage.setItem(
    'playlists',
    JSON.stringify(playlists.value)
  )

  newPlaylistName.value = ''
  showCreateModal.value = false
}

function deletePlaylist(id: string) {
  playlists.value = playlists.value.filter(
    (playlist) => playlist.id !== id
  )

  localStorage.setItem(
    'playlists',
    JSON.stringify(playlists.value)
  )

  if (selectedPlaylist.value?.id === id) {
    selectedPlaylist.value = null
  }
}

function openPlaylist(playlist: any) {
  selectedPlaylist.value = playlist
}

function closePlaylist() {
  selectedPlaylist.value = null
}

function playAllVideos() {
  if (!selectedPlaylist.value) return

  if (!selectedPlaylist.value.videos.length) return

  window.location.href = `/watch/${selectedPlaylist.value.videos[0].videoId}`
}

onMounted(() => {
  loadPlaylists()
})
</script>

<template>
  <Layout>

    <!-- fonts -->
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Material+Symbols+Outlined"
      rel="stylesheet"
    >

    <div
      class="bg-white text-[#0f0f0f] min-h-screen antialiased"
      style="font-family: Roboto, Arial, sans-serif;"
    >

      <!-- create modal -->
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-4"
      >

        <div
          class="w-full max-w-[520px] rounded-3xl bg-white shadow-2xl overflow-hidden"
        >

          <div
            class="px-8 pt-7 pb-5 border-b border-[#e5e5e5]"
          >

            <div
              class="text-[24px] font-bold tracking-[-0.5px]"
            >
              新しいプレイリスト
            </div>

            <div
              class="text-[14px] text-[#606060] mt-2"
            >
              プレイリスト名を入力してください
            </div>

          </div>

          <div
            class="px-8 py-7"
          >

            <input
              v-model="newPlaylistName"
              type="text"
              placeholder="プレイリスト名"
              class="w-full h-12 px-4 rounded-xl border border-[#d3d3d3] outline-none focus:border-[#065fd4] text-[15px]"
              @keyup.enter="createPlaylist"
            >

          </div>

          <div
            class="px-8 pb-7 flex items-center justify-end gap-3"
          >

            <button
              class="h-10 px-5 rounded-full hover:bg-[#f2f2f2] text-[#0f0f0f] text-[14px] font-medium transition-all duration-150"
              @click="showCreateModal = false"
            >
              キャンセル
            </button>

            <button
              class="h-10 px-5 rounded-full bg-[#0f0f0f] hover:bg-black text-white text-[14px] font-medium transition-all duration-150 disabled:opacity-40"
              :disabled="!newPlaylistName.trim()"
              @click="createPlaylist"
            >
              作成
            </button>

          </div>

        </div>

      </div>

      <div class="max-w-[1800px] mx-auto px-6 py-8">

        <!-- playlist detail -->
        <template v-if="selectedPlaylist">

          <!-- back -->
          <button
            class="mb-8 h-10 px-4 rounded-full hover:bg-[#f2f2f2] transition-all duration-150 flex items-center gap-2 text-[14px] font-medium"
            @click="closePlaylist"
          >

            <span class="material-symbols-outlined text-[20px]">
              arrow_back
            </span>

            戻る

          </button>

          <div
            class="flex gap-10 items-start"
          >

            <!-- left -->
            <div
              class="w-[360px] min-w-[360px] sticky top-6"
            >

              <div
                class="rounded-3xl overflow-hidden bg-[#f8f8f8] border border-[#ececec]"
              >

                <!-- thumbnail -->
                <div
                  class="aspect-video bg-[#f2f2f2] overflow-hidden"
                >

                  <img
                    v-if="selectedPlaylist.videos.length"
                    :src="selectedPlaylist.videos[0].thumbnail"
                    class="w-full h-full object-cover"
                  >

                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center"
                  >

                    <span
                      class="material-symbols-outlined text-[72px] text-[#909090]"
                    >
                      playlist_play
                    </span>

                  </div>

                </div>

                <!-- info -->
                <div
                  class="p-6"
                >

                  <div
                    class="text-[28px] font-bold tracking-[-0.5px] leading-[36px]"
                  >
                    {{ selectedPlaylist.name }}
                  </div>

                  <div
                    class="text-[14px] text-[#606060] mt-3"
                  >
                    {{ selectedPlaylist.videos.length }} 本の動画
                  </div>

                  <!-- play all -->
                  <button
                    class="mt-6 w-full h-11 rounded-full bg-[#0f0f0f] hover:bg-black text-white text-[14px] font-medium transition-all duration-150 flex items-center justify-center gap-2"
                    @click="playAllVideos"
                  >

                    <span class="material-symbols-outlined text-[20px]">
                      play_arrow
                    </span>

                    すべて再生

                  </button>

                </div>

              </div>

            </div>

            <!-- right -->
            <div
              class="flex-1"
            >

              <div
                v-if="selectedPlaylist.videos.length"
                class="space-y-2"
              >

                <RouterLink
                  v-for="(video, index) in selectedPlaylist.videos"
                  :key="video.videoId"
                  :to="`/watch/${video.videoId}`"
                  class="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#f2f2f2] transition-all duration-150 group"
                >

                  <!-- index -->
                  <div
                    class="w-8 text-center text-[14px] text-[#606060]"
                  >
                    {{ index + 1 }}
                  </div>

                  <!-- thumbnail -->
                  <div
                    class="w-[170px] aspect-video rounded-xl overflow-hidden bg-[#f2f2f2] flex-shrink-0"
                  >

                    <img
                      :src="video.thumbnail"
                      class="w-full h-full object-cover"
                    >

                  </div>

                  <!-- meta -->
                  <div
                    class="flex flex-col min-w-0"
                  >

                    <div
                      class="text-[16px] font-medium leading-[24px] line-clamp-2 text-[#0f0f0f]"
                    >
                      {{ video.title }}
                    </div>

                    <div
                      class="text-[14px] text-[#606060] mt-1"
                    >
                      {{ video.author }}
                    </div>

                  </div>

                </RouterLink>

              </div>

              <!-- empty -->
              <div
                v-else
                class="rounded-3xl border border-[#e5e5e5] bg-[#fafafa] py-20 flex flex-col items-center justify-center"
              >

                <div
                  class="w-24 h-24 rounded-full bg-[#f1f1f1] flex items-center justify-center"
                >

                  <span
                    class="material-symbols-outlined text-[48px] text-[#909090]"
                  >
                    playlist_play
                  </span>

                </div>

                <div
                  class="mt-6 text-[22px] font-medium"
                >
                  動画がありません
                </div>

                <div
                  class="text-[#606060] text-[14px] mt-2"
                >
                  このプレイリストにはまだ動画が保存されていません
                </div>

              </div>

            </div>

          </div>

        </template>

        <!-- playlists -->
        <template v-else>

          <!-- header -->
          <div class="flex items-center justify-between mb-10">

            <div>

              <h1
                class="text-[36px] font-bold tracking-[-1px] leading-none"
              >
                プレイリスト
              </h1>

              <div
                class="text-[#606060] mt-2 text-[14px] font-normal"
              >
                保存したプレイリスト
              </div>

            </div>

            <button
              class="h-10 px-4 rounded-full border border-[#d3d3d3] bg-white hover:bg-[#f2f2f2] active:bg-[#e5e5e5] transition-all duration-150 flex items-center gap-2 text-[14px] font-medium"
              @click="showCreateModal = true"
            >

              <span class="material-symbols-outlined text-[22px]">
                add
              </span>

              新しいプレイリスト

            </button>

          </div>

          <!-- playlist list -->
          <div
            v-if="playlists.length"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8"
          >

            <div
              v-for="playlist in playlists"
              :key="playlist.id"
              class="group cursor-pointer"
              @click="openPlaylist(playlist)"
            >

              <!-- thumb -->
              <div
                class="relative aspect-video overflow-hidden rounded-xl bg-[#f2f2f2]"
              >

                <img
                  v-if="playlist.videos.length"
                  :src="playlist.videos[0].thumbnail"
                  class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                >

                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >

                  <span
                    class="material-symbols-outlined text-[62px] text-[#909090]"
                  >
                    playlist_play
                  </span>

                </div>

                <!-- overlay -->
                <div
                  class="absolute top-0 right-0 w-[40%] h-full bg-black/75 flex flex-col items-center justify-center text-white"
                >

                  <span
                    class="text-[18px] font-medium"
                  >
                    {{ playlist.videos.length }}
                  </span>

                  <span
                    class="material-symbols-outlined text-[22px]"
                  >
                    playlist_play
                  </span>

                </div>

                <!-- hover -->
                <div
                  class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center"
                >

                  <div
                    class="flex items-center gap-2 text-white text-[14px] font-medium"
                  >

                    <span class="material-symbols-outlined text-[20px]">
                      play_arrow
                    </span>

                    表示

                  </div>

                </div>

              </div>

              <!-- info -->
              <div
                class="mt-3"
              >

                <div
                  class="text-[16px] font-medium leading-[22px] line-clamp-2"
                >
                  {{ playlist.name }}
                </div>

                <div
                  class="flex items-center justify-between mt-1"
                >

                  <div
                    class="text-[14px] text-[#606060]"
                  >
                    {{ playlist.videos.length }} 本の動画
                  </div>

                  <button
                    class="w-9 h-9 rounded-full hover:bg-[#f2f2f2] flex items-center justify-center transition-all duration-150"
                    @click.stop="deletePlaylist(playlist.id)"
                  >

                    <span
                      class="material-symbols-outlined text-[20px] text-[#606060]"
                    >
                      delete
                    </span>

                  </button>

                </div>

              </div>

            </div>

          </div>

          <!-- no playlists -->
          <div
            v-else
            class="flex flex-col items-center justify-center py-36"
          >

            <div
              class="w-32 h-32 rounded-full bg-[#f2f2f2] flex items-center justify-center"
            >

              <span
                class="material-symbols-outlined text-[56px] text-[#606060]"
              >
                video_library
              </span>

            </div>

            <div
              class="mt-8 text-[30px] font-bold tracking-[-0.5px]"
            >
              プレイリストがありません
            </div>

            <div
              class="text-[#606060] mt-3 text-center text-[15px] leading-[24px]"
            >
              お気に入りの動画を保存して<br>
              YouTube のようにプレイリストを整理できます
            </div>

            <button
              class="mt-8 h-10 px-5 rounded-full bg-[#0f0f0f] hover:bg-black active:bg-[#202020] transition-all duration-150 text-white text-[14px] font-medium flex items-center gap-2"
              @click="showCreateModal = true"
            >

              <span class="material-symbols-outlined text-[20px]">
                add
              </span>

              プレイリストを作成

            </button>

          </div>

        </template>

      </div>

    </div>

  </Layout>
</template>
