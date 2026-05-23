<script setup lang="ts">
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
</script>

<template>
  <div class="layout-container">
    <Header />
    <Sidebar />

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout-container {
  --sidebar-width: 240px;
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
}

.main-content {
  padding-top: 4rem;
  width: 100%;
}
</style>
