<script setup lang="ts">
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
</script>

<template>
  <Header />
  <Sidebar />

  <main class="pt-16 pl-60">
    <slot />
  </main>
</template>
