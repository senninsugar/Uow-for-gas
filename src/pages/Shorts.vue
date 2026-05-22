<template>
  <div class="h-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white">

    <div
      v-for="i in 10"
      :key="i"
      class="h-screen flex items-center justify-center snap-start"
    >
      <div class="w-[400px] h-[700px] bg-zinc-900 rounded-3xl flex items-center justify-center text-4xl">
        SHORT {{ i }}
      </div>
    </div>

  </div>
</template>
