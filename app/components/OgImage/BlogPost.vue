<script setup lang="ts">
defineProps<{
  title: string
  category?: string
  image?: string
}>()
</script>

<template>
  <div class="w-full h-full flex flex-col bg-[#0D0D0D] relative overflow-hidden">
    <!-- Background image -->
    <img v-if="image" :src="image" class="absolute inset-0 w-full h-full object-cover opacity-30" />

    <!-- Gradient overlay -->
    <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 100%)" />

    <!-- Content -->
    <div class="absolute bottom-0 left-0 right-0 p-14 flex flex-col gap-4">
      <span v-if="category" class="text-[#4bc471] text-[18px] font-bold uppercase tracking-[4px]">
        {{ category }}
      </span>
      <h1 class="text-white text-[52px] font-bold leading-tight" style="max-width: 900px">
        {{ title }}
      </h1>
      <div class="flex items-center gap-3 mt-2">
        <span class="text-[#4bc471] text-[22px] font-bold">NeuralBriefly</span>
        <span class="text-white/40 text-[22px]">·</span>
        <span class="text-white/60 text-[20px]">AI News & Analysis</span>
      </div>
    </div>
  </div>
</template>
