import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: true,
  }),

  actions: {
    toggleSidebar() {
      this.sidebar = !this.sidebar
    },
  },
})
