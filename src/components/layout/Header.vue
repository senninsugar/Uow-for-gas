<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineEmits, watch } from 'vue'
import { useRouter } from 'vue-router'
import youtubeLogoBase64 from '../img/youtubelogo.txt?raw'
import Voice from './voice.vue'
import Account from './account.vue'
import { fetchSuggestions } from '../api/suggest'

const emit = defineEmits(['toggle-sidebar'])

const query = ref('')
const router = useRouter()

const notifications = ref<any[]>([])
const showNotifications = ref(false)
const notificationRef = ref<HTMLElement | null>(null)

const showAccount = ref(false)
const accountRef = ref<HTMLElement | null>(null)

const showVoice = ref(false)
const recognition = ref<any>(null)

const suggestions = ref<string[]>()
const showSuggestions = ref(false)
const activeSuggestionIndex = ref(-1)
const searchContainerRef = ref<HTMLElement | null>(null)

const unreadCount = () => notifications.value.filter(n => n.unread).length

watch(query, async (newQuery) => {
  if (!newQuery.trim()) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }
  
  if (activeSuggestionIndex.value === -1) {
    const res = await fetchSuggestions(newQuery)
    suggestions.value = res
    showSuggestions.value = res.length > 0
  }
})

onMounted(async () => {
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0'
  link.rel = 'stylesheet'
  document.head.appendChild(link)

  try {
    const response = await fetch('https://raw.githubusercontent.com/senninsugar/senninservice/refs/heads/main/blog/uowblog.json')
    notifications.value = await response.json()
  } catch (e) {
    console.error('通知の取得に失敗しました', e)
  }

  document.addEventListener('click', handleClickOutside)

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition

  if (SpeechRecognition) {
    recognition.value = new SpeechRecognition()
    recognition.value.lang = 'ja-JP'
    recognition.value.interimResults = true
    recognition.value.continuous = false

    recognition.value.onresult = (event: any) => {
      let transcript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }

      query.value = transcript
    }

    recognition.value.onend = () => {
      showVoice.value = false
    }

    recognition.value.onerror = () => {
      showVoice.value = false
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)

  if (recognition.value) {
    recognition.value.stop()
  }
})

function handleClickOutside(event: MouseEvent) {
  if (notificationRef.value && !notificationRef.value.contains(event.target as Node)) {
    showNotifications.value = false
  }
  if (accountRef.value && !accountRef.value.contains(event.target as Node)) {
    showAccount.value = false
  }
  if (searchContainerRef.value && !searchContainerRef.value.contains(event.target as Node)) {
    showSuggestions.value = false
  }
}

function search() {
  if (!query.value.trim()) return
  showSuggestions.value = false
  router.push(`/results?search_query=${encodeURIComponent(query.value)}`)
}

function selectSuggestion(suggestion: string) {
  query.value = suggestion
  search()
}

function handleKeyDown(event: KeyboardEvent) {
  if (!showSuggestions.value || !suggestions.value || suggestions.value.length === 0) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (activeSuggestionIndex.value < suggestions.value.length - 1) {
      activeSuggestionIndex.value++
      query.value = suggestions.value[activeSuggestionIndex.value]
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (activeSuggestionIndex.value > 0) {
      activeSuggestionIndex.value--
      query.value = suggestions.value[activeSuggestionIndex.value]
    } else if (activeSuggestionIndex.value === 0) {
      activeSuggestionIndex.value = -1
    }
  } else if (event.key === 'Escape') {
    showSuggestions.value = false
  }
}

function startVoiceSearch() {
  if (!recognition.value) {
    alert('このブラウザは音声入力に対応していません')
    return
  }

  showVoice.value = true
  recognition.value.start()
}
</script>

<template>
  <header class="h-14 flex items-center justify-between px-4 fixed top-0 left-0 right-0 bg-white text-black z-50 select-none">
      
    <div class="flex items-center gap-4">
      <button
        @click="emit('toggle-sidebar')"
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
      >
        <span class="material-symbols-outlined text-[24px]">menu</span>
      </button>
        
      <a href="/" class="flex items-center cursor-pointer" style="height: 40px;">
        <img 
          :src="youtubeLogoBase64.trim().startsWith('data:') ? youtubeLogoBase64.trim() : 'data:image/jpeg;base64,' + youtubeLogoBase64.replace(/\s/g, '')" 
          alt="YouTube Logo" 
          class="h-full object-contain"
        />
      </a>
    </div>

    <div ref="searchContainerRef" class="flex flex-1 max-w-[732px] items-center gap-4 mx-4 relative">
      <div class="flex flex-1 items-center relative">
        <div class="flex flex-1 bg-white border border-zinc-300 rounded-l-full px-4 h-10 items-center focus-within:border-blue-500 focus-within:shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
          <input
            v-model="query"
            class="w-full bg-transparent outline-none text-base text-black placeholder-zinc-400"
            placeholder="検索"
            @keyup.enter="search"
            @keydown="handleKeyDown"
            @focus="showSuggestions = query.trim().length > 0 && suggestions && suggestions.length > 0"
          />
          <button 
            v-if="query" 
            @click="query = ''; suggestions = []; showSuggestions = false; activeSuggestionIndex = -1" 
            class="text-zinc-500 hover:text-black mr-1"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <button
          @click="search"
          class="w-[64px] h-10 bg-zinc-50 border border-l-0 border-zinc-300 rounded-r-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
          title="検索"
        >
          <span class="material-symbols-outlined text-[22px] text-zinc-700">search</span>
        </button>

        <div 
          v-if="showSuggestions && suggestions && suggestions.length > 0" 
          class="absolute top-11 left-0 right-[64px] bg-white border border-zinc-200 shadow-xl rounded-2xl py-3 z-50 overflow-hidden"
        >
          <ul>
            <li 
              v-for="(suggestion, index) in suggestions" 
              :key="index"
              @click="selectSuggestion(suggestion)"
              @mouseenter="activeSuggestionIndex = index"
              :class="[
                'px-4 py-1.5 flex items-center gap-3 cursor-pointer text-sm font-medium transition-colors',
                index === activeSuggestionIndex ? 'bg-zinc-100 text-black' : 'text-zinc-900'
              ]"
            >
              <span class="material-symbols-outlined text-[20px] text-zinc-500">search</span>
              <span>{{ suggestion }}</span>
            </li>
          </ul>
        </div>
      </div>

      <button
        @click="startVoiceSearch"
        class="w-10 h-10 bg-zinc-50 hover:bg-zinc-100 active:bg-zinc-200 rounded-full flex items-center justify-center transition-colors"
        title="音声で検索"
      >
        <span class="material-symbols-outlined text-[24px]">mic</span>
      </button>
    </div>

    <div class="flex items-center gap-2">
      <div ref="notificationRef" class="relative flex items-center">
        <button 
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 relative transition-colors" 
          title="通知"
          @click="showNotifications = !showNotifications; showAccount = false"
        >
          <span class="material-symbols-outlined text-[24px]">notifications</span>
          <span 
            v-if="unreadCount() > 0" 
            class="absolute top-1 right-1 bg-red-600 text-[10px] font-medium text-white px-1 rounded-full min-w-[16px] text-center"
          >
            {{ unreadCount() > 9 ? '9+' : unreadCount() }}
          </span>
        </button>

        <div 
          v-if="showNotifications"
          class="absolute top-14 right-0 w-80 bg-white border border-zinc-200 shadow-lg rounded-xl overflow-hidden z-50"
        >
          <div class="p-4 border-b border-zinc-100 font-bold">通知</div>
          <div class="max-h-[400px] overflow-y-auto">
            <div 
              v-for="(item, index) in notifications" 
              :key="index"
              class="p-4 hover:bg-zinc-50 cursor-pointer border-b border-zinc-50"
            >
              <p class="text-sm text-zinc-800">{{ item.title }}</p>
              <p class="text-xs text-zinc-500 mt-1">{{ item.date }}</p>
            </div>
          </div>
        </div>
      </div>

      <div ref="accountRef" class="relative flex items-center">
        <button 
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors" 
          title="アカウント"
          @click="showAccount = !showAccount; showNotifications = false"
        >
          <span class="material-symbols-outlined text-[24px]">account_circle</span>
        </button>

        <Account v-if="showAccount" />
      </div>
    </div>

    <Voice v-if="showVoice" />
  </header>
</template>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>
