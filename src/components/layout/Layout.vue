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
}

.main-content {
  padding-top: 4rem;
  padding-left: var(--sidebar-width);
  transition: padding-left 0.3s ease;
}
</style>
