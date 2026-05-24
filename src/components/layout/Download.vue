<!-- components/layout/Download.vue -->
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
      <!-- BACKDROP -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="closeModal"
      />

      <!-- MODAL -->
      <div
        class="relative w-full max-w-2xl mx-4 bg-white rounded-3xl overflow-hidden shadow-2xl"
      >

        <!-- HEADER -->
        <div class="px-6 h-16 border-b border-zinc-200 flex items-center justify-between">
          <div class="text-lg font-bold">
            Download Formats
          </div>

          <button
            class="w-10 h-10 rounded-full hover:bg-zinc-100 transition"
            @click="closeModal"
          >
            ✕
          </button>
        </div>

        <!-- CONTENT -->
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
              class="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition"
            >

              <div>
                <div class="font-semibold">
                  {{
                    format.qualityLabel ||
                    format.audioQuality ||
                    'Unknown Quality'
                  }}
                </div>

                <div class="text-sm text-zinc-500 mt-1">
                  {{ format.mimeType || format.type }}
                </div>
              </div>

              <div
                class="bg-black text-white px-4 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
              >
                Download
              </div>

            </a>

          </div>

          <div
            v-else
            class="text-center text-zinc-500 py-16"
          >
            No downloadable formats found.
          </div>

        </div>

      </div>
    </div>
  </Teleport>
</template>
