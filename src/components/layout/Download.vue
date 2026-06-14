<script setup lang="ts">
defineProps<{
  open: boolean
  formats: any[]
}>()

const emit = defineEmits<{
  close: []
}>()

function closeModal() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        @click="closeModal"
      />

      <div
        class="relative w-full max-w-2xl mx-4 bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 select-none"
      >

        <div class="px-6 h-16 border-b border-zinc-200 flex items-center justify-between">
          <div class="text-lg font-bold text-zinc-900">
            ダウンロード形式の選択
          </div>

          <button
            class="w-10 h-10 rounded-full hover:bg-zinc-100 active:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black transition-colors"
            @click="closeModal"
            title="閉じる"
          >
            ✕
          </button>
        </div>

        <div class="p-6 max-h-[70vh] overflow-y-auto">

          <div
            v-if="formats?.length"
            class="space-y-3"
          >

            <a
              v-for="format in formats"
              :key="format.itag"
              :href="format.url"
              target="_blank"
              class="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80 active:bg-zinc-100 transition-all group"
            >

              <div class="pr-4">
                <div class="font-bold text-zinc-900 group-hover:text-black">
                  {{
                    format.qualityLabel ||
                    format.audioQuality ||
                    '不明な画質・音質'
                  }}
                </div>

                <div class="text-xs text-zinc-500 font-medium mt-1.5 break-all">
                  {{ format.mimeType || format.type }}
                </div>
              </div>

              <div
                class="bg-zinc-950 text-white px-5 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm group-hover:bg-zinc-800 active:scale-95 transition-all"
              >
                ダウンロード
              </div>

            </a>

          </div>

          <div
            v-if="!formats?.length"
            class="text-center text-zinc-500 py-16 flex flex-col items-center justify-center gap-2"
          >
            <div class="text-base font-medium">ダウンロード可能な形式が見つかりませんでした。</div>
            <div class="text-xs text-zinc-400">この動画は現在変換中か、取得に対応していない可能性があります。</div>
          </div>

        </div>

      </div>
    </div>
  </Teleport>
</template>
