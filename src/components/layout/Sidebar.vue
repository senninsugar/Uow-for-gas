<template>
  <aside class="sidebar" :class="{ 'compact-mode': !isOpen && !isHidden, 'hidden-mode': isHidden, 'is-open': isHidden && isOpen }">
    <nav class="sidebar-nav">
      <router-link to="/" class="sidebar-item" :class="{ active: isActive('/') }">
        <span class="sidebar-icon">
          <span class="material-symbols-outlined">home</span>
        </span>
        <span class="sidebar-label">ホーム</span>
      </router-link>
      
      <router-link to="/subscriptions" class="sidebar-item" :class="{ active: isActive('/subscriptions') }">
        <span class="sidebar-icon">
          <span class="material-symbols-outlined">subscriptions</span>
        </span>
        <span class="sidebar-label">登録チャンネル</span>
      </router-link>
      
      <router-link to="/playlists" class="sidebar-item" :class="{ active: isActive('/playlists') }">
        <span class="sidebar-icon">
          <span class="material-symbols-outlined">playlist_play</span>
        </span>
        <span class="sidebar-label">再生リスト</span>
      </router-link>
      
      <router-link to="/history" class="sidebar-item" :class="{ active: isActive('/history') }">
        <span class="sidebar-icon">
          <span class="material-symbols-outlined">history</span>
        </span>
        <span class="sidebar-label">履歴</span>
      </router-link>
      
      <button 
        type="button" 
        class="sidebar-item sidebar-button" 
        @click="openSettings"
        :class="{ active: isActive('/settings') }"
      >
        <span class="sidebar-icon">
          <span class="material-symbols-outlined">settings</span>
        </span>
        <span class="sidebar-label">設定</span>
      </button>
    </nav>
  </aside>
</template>

<script>
import { ref, computed, onMounted, watch, inject, onUnmounted, nextTick } from 'vue';

export default {
  name: 'Sidebar',
  props: {
    open: {
      type: Boolean,
      default: true
    }
    ,
    isWatchPage: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const isOpen = ref(props.open);
    const viewportWidth = ref(window.innerWidth);
    const settingsModal = inject('settingsModal', {});
    const SIDEBAR_STATE_KEY = 'youtube_sidebar_state';

    const isHidden = computed(() => {
      const threshold = props.isWatchPage ? 1330 : 790;
      return viewportWidth.value < threshold;
    });

    const initializeState = () => {
      const width = window.innerWidth;
      if (width >= 1315) {
        isOpen.value = true;
      } else if (width >= 790) {
        isOpen.value = false;
      } else {
        isOpen.value = false;
      }
    };

    const toggleSidebarInHiddenMode = () => {
      if (isHidden.value) {
        isOpen.value = !isOpen.value;
      }
    };

    const updateBodyClass = () => {
      const body = document.body;
      let state = 'open';
      if (isHidden.value) state = 'hidden';
      else if (!isOpen.value) state = 'compact';

      body.classList.toggle('sidebar-compact', state === 'compact');
      body.classList.toggle('sidebar-hidden', state === 'hidden');

      const offsetMap = {
        open: '250px',
        compact: '70px',
        hidden: '0px'
      };
      const offset = offsetMap[state] || '250px';
      body.style.setProperty('--sidebar-offset', offset);

      console.log(`[Sidebar.vue] updateBodyClass: isOpen=${isOpen.value}, isHidden=${isHidden.value}, state=${state}, stored=${localStorage.getItem(SIDEBAR_STATE_KEY)}`);

      try {
        localStorage.setItem(SIDEBAR_STATE_KEY, state);
        console.log(`[Sidebar.vue] Saved to localStorage: youtube_sidebar_state=${state}`);
      } catch (e) {
        console.error('[Sidebar.vue] Failed to save to localStorage', e);
      }
    };

    const openSettings = () => {
      console.log('[Sidebar.vue] openSettings called');
      console.log('[Sidebar.vue] settingsModal object:', settingsModal);
      console.log('[Sidebar.vue] settingsModal.openSettingsModal exists:', !!settingsModal?.openSettingsModal);
      if (settingsModal?.openSettingsModal) {
        console.log('[Sidebar.vue] Calling openSettingsModal()');
        settingsModal.openSettingsModal();
      } else {
        console.warn('[Sidebar.vue] WARNING: openSettingsModal is not available');
      }
    };

    const isActive = (path) => {
      return false;
    };

    onMounted(() => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      try {
        localStorage.removeItem(SIDEBAR_STATE_KEY);
        console.log('[Sidebar.vue] Cleared persisted sidebar state, using screen-size defaults');
      } catch (e) {
        console.warn('[Sidebar.vue] Failed to clear sidebar state from localStorage', e);
      }

      initializeState();
      updateBodyClass();
      
      try {
        nextTick(() => {
          updateBodyClass();
        });
      } catch (e) {
        updateBodyClass();
      }

      const handleResize = () => {
        viewportWidth.value = window.innerWidth;
        initializeState();
        updateBodyClass();
      };
      window.addEventListener('resize', handleResize);
    });

    watch(() => props.open, (newValue) => {
      isOpen.value = newValue;
    });

    watch([isOpen, isHidden], () => {
      updateBodyClass();
    });

    onUnmounted(() => {
      const body = document.body;
      body.classList.remove('sidebar-compact');
      body.classList.remove('sidebar-hidden');
    });

    return {
      isOpen,
      isHidden,
      viewportWidth,
      settingsModal,
      openSettings,
      isActive,
      toggleSidebarInHiddenMode
    };
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    }
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 56px;
  width: 250px;
  height: calc(100vh - 56px);
  background-color: #ffffff;
  border-right: 1px solid #e5e5e5;
  overflow-y: auto;
  z-index: 10;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.25s ease;
}

:global(body.settings-modal-open) .sidebar {
  height: auto;
  max-height: calc(100vh - 56px);
}

.sidebar.compact-mode {
  width: 70px;
}

.sidebar.hidden-mode {
  transform: translateX(-100%);
  display: block;
  width: 250px;
}

.sidebar.hidden-mode.is-open {
  transform: translateX(0);
  z-index: 999;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 12px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: #0f0f0f;
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
  border-left: 3px solid transparent;
}

.sidebar-item.sidebar-button {
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.sidebar.compact-mode .sidebar-item {
  padding: 16px 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.sidebar-item:hover {
  background-color: #f2f2f2;
}

.sidebar-item:active {
  transform: scale(0.98);
}

.sidebar-item.active {
  background-color: #f2f2f2;
  border-left-color: #ff0000;
  color: #ff0000;
  font-weight: 600;
}

.sidebar-item.active .material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.sidebar.compact-mode .sidebar-item.active {
  border-left: none;
  border-bottom: 3px solid #ff0000;
}

.sidebar-icon {
  margin-right: 16px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.sidebar-item:hover .sidebar-icon {
  transform: translateY(-1px);
}

.sidebar.compact-mode .sidebar-icon {
  margin-right: 0;
}

.sidebar-label {
  font-size: 14px;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}

.sidebar.compact-mode .sidebar-label {
  display: block;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 64px;
  text-align: center;
  line-height: 1.2;
}

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
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

@media (max-width: 1314px) {
  .sidebar {
    width: 250px;
  }

  .sidebar.compact-mode {
    width: 70px;
  }
}

@media (max-width: 789px) {
  .sidebar {
    transform: translateX(-100%);
    display: block;
    width: 250px;
  }

  .sidebar.hidden-mode {
    transform: translateX(-100%);
    display: block;
    width: 250px;
  }

  .sidebar.hidden-mode.is-open {
    transform: translateX(0);
    z-index: 999;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}
</style>
