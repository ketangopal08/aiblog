<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

const scrolled = ref(false)

onMounted(() => {
  const onScroll = () => {
    if (!scrolled.value && window.scrollY > 60) scrolled.value = true
    else if (scrolled.value && window.scrollY < 10) scrolled.value = false
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

const NAV_LINKS = [
  { label: 'HOME',    to: '/' },
  { label: 'ABOUT',   to: '/about' },
  { label: 'GPT',     to: '/category/gpt' },
  { label: 'GEMINI',  to: '/category/gemini' },
  { label: 'CLAUDE',  to: '/category/claude' },
  { label: 'AI',      to: '/category/ai' },
  { label: 'CONTACT', to: '/about' },
]
</script>

<template>
  <header class="bg-white dark:bg-[#0D0D0D] border-b border-gray-200 dark:border-[#222222] sticky top-0 z-50 transition-colors duration-300">

    <!-- ── Top bar: social | logo (centered) | actions ── -->
    <div
      class="max-w-7xl mx-auto px-6 flex items-center justify-between relative overflow-hidden transition-all duration-300 ease-in-out"
      :class="scrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-40 py-4 opacity-100'"
    >

      <!-- Social icons (3 circular) -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <a href="#" aria-label="Facebook"
          class="w-8 h-8 rounded-full border border-gray-300 dark:border-[#2d2d2d] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#ff5811] hover:text-[#ff5811] transition">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
          </svg>
        </a>
        <a href="#" aria-label="X / Twitter"
          class="w-8 h-8 rounded-full border border-gray-300 dark:border-[#2d2d2d] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#ff5811] hover:text-[#ff5811] transition">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="#" aria-label="Instagram"
          class="w-8 h-8 rounded-full border border-gray-300 dark:border-[#2d2d2d] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#ff5811] hover:text-[#ff5811] transition">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
          </svg>
        </a>
      </div>

      <!-- Logo – absolutely centered -->
      <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 text-center select-none">
        <div class="text-5xl font-black leading-none tracking-tight uppercase font-serif" style="color:#ff5811; letter-spacing:-1px;">
          AI BLOG
        </div>
        <div class="text-[9px] text-gray-400 dark:text-gray-500 tracking-[0.25em] uppercase mt-1">
          CLEAN&nbsp;|&nbsp;CREATIVE&nbsp;|&nbsp;PRACTICAL&nbsp;|&nbsp;SIMPLE TO SETUP
        </div>
      </NuxtLink>

      <!-- Right: Subscribe + theme icon -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <button
          class="text-white text-xs font-black px-5 py-2 uppercase tracking-wider transition hover:opacity-90"
          style="background:#ff5811"
        >
          Subscribe
        </button>
        <!-- Icon-only dark/light toggle -->
        <button
          @click="toggleTheme"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="w-9 h-9 flex items-center justify-center border border-gray-300 dark:border-[#2d2d2d] text-gray-600 dark:text-gray-300 hover:border-[#ff5811] hover:text-[#ff5811] transition"
        >
          <!-- Sun (light mode) -->
          <svg v-if="!isDark" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4"/>
            <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <!-- Moon (dark mode) -->
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- ── Nav bar ── -->
    <nav class="border-t border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0D0D0D]">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-center h-11 gap-0">

        <!-- Hamburger -->
        <button
          class="flex flex-col justify-center gap-[5px] w-8 h-8 flex-shrink-0 text-gray-600 dark:text-gray-400 transition mr-2"
          style="--hover-color:#ff5811"
        >
          <span class="block w-5 h-[1.5px] bg-current" />
          <span class="block w-5 h-[1.5px] bg-current" />
          <span class="block w-5 h-[1.5px] bg-current" />
        </button>

        <!-- Nav links with pipe separators -->
        <div class="flex items-center overflow-x-auto scrollbar-hide">
          <template v-for="(link, i) in NAV_LINKS" :key="link.label">
            <NuxtLink
              :to="link.to"
              class="text-[11px] font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap px-4 transition hover:text-[#ff5811]"
              active-class="!text-[#ff5811]"
            >
              {{ link.label }}
            </NuxtLink>
            <span v-if="i < NAV_LINKS.length - 1" class="text-gray-300 dark:text-gray-600 select-none flex-shrink-0 text-sm">|</span>
          </template>
        </div>

        <!-- Search icon -->
        <button
          class="flex-shrink-0 w-8 h-8 flex items-center justify-center ml-2 text-gray-600 dark:text-gray-400 hover:text-[#ff5811] transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7"/>
            <path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
          </svg>
        </button>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
