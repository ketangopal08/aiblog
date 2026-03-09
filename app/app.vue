<script setup lang="ts">
const { initTheme } = useTheme()
// Sync isDark reactive state with what the plugin set on <html>
onMounted(() => initTheme())
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-[#0D0D0D] transition-colors duration-300 dark:[color-scheme:dark]">
    <NuxtRouteAnnouncer />
    <AppHeader />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>
