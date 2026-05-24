import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Watch from '../pages/Watch.vue'
import Search from '../pages/Search.vue'
import Shorts from '../pages/Shorts.vue'
import Channel from '../pages/Channel.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: Home,
    },

    {
      path: '/watch/:id',
      component: Watch,
    },

    {
      path: '/results',
      component: Search,
    },

    {
      path: '/shorts',
      component: Shorts,
    },

    {
      path: '/channel/:id',
      component: Channel,
    },
  ],
})

export default router
