<script setup lang="ts">
defineProps<{
  items: Array<{ label: string; to?: string }>
}>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px] mb-6 flex-wrap">
    <template v-for="(item, index) in items" :key="index">
      <span v-if="index > 0" class="text-gray-300 dark:text-gray-600 select-none">/</span>
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        {{ item.label }}
      </NuxtLink>
      <span
        v-else
        class="text-gray-900 dark:text-white font-medium truncate max-w-[240px]"
        aria-current="page"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
