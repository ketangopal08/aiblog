<script setup lang="ts">
const { initTheme } = useTheme()
// Sync isDark reactive state with what the plugin set on <html>
onMounted(() => initTheme())
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
    <NuxtRouteAnnouncer />
    <AppHeader />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>
