<script setup lang="ts">
const { initTheme, isDark } = useTheme()

onMounted(() => {
  initTheme()
  updateThemeColor()
})

watch(isDark, updateThemeColor)

function updateThemeColor() {
  const color = isDark.value ? '#0D0D0D' : '#ffffff'
  document.querySelectorAll('meta[name="theme-color"]').forEach(el => {
    (el as HTMLMetaElement).content = color
  })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-[#0D0D0D] transition-colors duration-300 dark:[color-scheme:dark] font-sans">
    <NuxtLoadingIndicator color="#27ae60" :height="3" :duration="2000" :throttle="0" />
    <NuxtRouteAnnouncer />
    <AppHeader />
    <main class="flex-1 pt-5">
      <NuxtPage />
    </main>
    <AppFooter />
    <ClientOnly>
      <SearchModal />
    </ClientOnly>
  </div>
</template>
