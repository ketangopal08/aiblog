<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

const NAV_LINKS = [
  { label: 'GPT',     to: '/category/gpt' },
  { label: 'Gemini',  to: '/category/gemini' },
  { label: 'Claude',  to: '/category/claude' },
  { label: 'AI',      to: '/' },
  { label: 'Reviews', to: '/' },
  { label: 'Policy',  to: '/about' },
]
</script>

<template>
  <header class="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">

    <!-- Top strip -->
    <div class="flex justify-end items-center gap-3 px-6 pt-2 pb-1 border-b border-gray-100 dark:border-gray-800">
      <button
        class="bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold px-4 py-1.5 rounded transition tracking-wide uppercase"
      >
        Subscribe
      </button>
      <button
        class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition flex items-center gap-1"
      >
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
        Sign In
      </button>
    </div>

    <!-- Main nav -->
    <nav class="max-w-7xl mx-auto px-4 flex items-center h-12 gap-0">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="text-gray-900 dark:text-white font-black text-2xl italic tracking-tighter mr-2 hover:text-teal-500 transition flex-shrink-0"
      >
        AI<span class="text-teal-500">Blog</span>
      </NuxtLink>

      <!-- Slash-separated nav links -->
      <div class="flex items-center overflow-x-auto scrollbar-hide flex-1 min-w-0">
        <template v-for="link in NAV_LINKS" :key="link.label">
          <span class="text-gray-300 dark:text-gray-600 mx-2 select-none flex-shrink-0">/</span>
          <NuxtLink
            :to="link.to"
            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white whitespace-nowrap transition flex-shrink-0"
          >
            {{ link.label }}
          </NuxtLink>
        </template>
      </div>

      <!-- Dark/Light toggle -->
      <button
        @click="toggleTheme"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        class="ml-3 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-200"
      >
        <!-- Sun icon (shown in dark mode) -->
        <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.36-6.36l-.71.71M6.34 17.66l-.71.71M17.66 17.66l.71.71M6.34 6.34l.71.71M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
        <!-- Moon icon (shown in light mode) -->
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </button>

      <!-- Hamburger -->
      <button class="ml-2 flex-shrink-0 flex flex-col gap-1 p-2 text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition">
        <span class="block w-5 h-0.5 bg-current" />
        <span class="block w-5 h-0.5 bg-current" />
        <span class="block w-5 h-0.5 bg-current" />
      </button>
    </nav>
  </header>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
