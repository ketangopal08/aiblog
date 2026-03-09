<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

const menuOpen = ref(false)

const NAV_LINKS = [
  { label: 'Home',    to: '/' },
  { label: 'About',   to: '/about' },
  { label: 'GPT',     to: '/category/gpt' },
  { label: 'Gemini',  to: '/category/gemini' },
  { label: 'Claude',  to: '/category/claude' },
  { label: 'AI',      to: '/category/ai' },
  { label: 'Contact', to: '/about' },
]

// close menu on route change
const route = useRoute()
watch(() => route.path, () => { menuOpen.value = false })
</script>

<template>
  <header class="bg-white dark:bg-[#0D0D0D] border-b border-gray-200 dark:border-[#222222] sticky top-0 z-50">

    <!-- ── Single bar ── -->
    <div class="relative flex items-center h-14 px-4 sm:px-6">

      <!-- LEFT: burger | divider | search | bell -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <!-- Burger -->
        <button
          @click="menuOpen = !menuOpen"
          aria-label="Toggle menu"
          class="w-10 h-10 flex items-center justify-center text-gray-800 dark:text-gray-100 hover:text-[#ff5811] transition"
        >
          <!-- animated bars -->
          <span class="flex flex-col gap-[5px]">
            <span
              class="block h-[1.5px] bg-current transition-all duration-300 origin-center"
              :class="menuOpen ? 'w-5 rotate-45 translate-y-[6.5px]' : 'w-5'"
            />
            <span
              class="block h-[1.5px] bg-current transition-all duration-300"
              :class="menuOpen ? 'w-0 opacity-0' : 'w-5'"
            />
            <span
              class="block h-[1.5px] bg-current transition-all duration-300 origin-center"
              :class="menuOpen ? 'w-5 -rotate-45 -translate-y-[6.5px]' : 'w-5'"
            />
          </span>
        </button>

        <!-- divider -->
        <span class="w-px h-5 bg-gray-300 dark:bg-[#333] mx-1" />

        <!-- Search -->
        <button aria-label="Search" class="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#ff5811] transition">
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7"/>
            <path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
          </svg>
        </button>

      </div>

      <!-- CENTER: logo absolutely centered -->
      <NuxtLink
        to="/"
        class="absolute left-1/2 -translate-x-1/2 select-none whitespace-nowrap"
      >
        <span class="text-[1.35rem] font-black tracking-tight leading-none text-gray-900 dark:text-white">
          theintelliprompt
        </span>
      </NuxtLink>

      <!-- RIGHT: dark-mode toggle | Sign In | Subscribe -->
      <div class="ml-auto flex items-center gap-2 flex-shrink-0">
        <!-- dark/light toggle -->
        <button
          @click="toggleTheme"
          :title="isDark ? 'Light mode' : 'Dark mode'"
          class="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#ff5811] transition"
        >
          <svg v-if="!isDark" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4"/>
            <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </button>

        <!-- Subscribe -->
        <button class="hidden sm:flex items-center text-xs font-bold px-4 h-9 border border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition">
          Subscribe
        </button>
      </div>
    </div>

    <!-- ── Slide-down nav drawer ── -->
    <div
      class="overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 dark:border-[#1f1f1f]"
      :class="menuOpen ? 'max-h-96' : 'max-h-0 border-transparent'"
    >
      <nav class="bg-white dark:bg-[#0D0D0D] px-4 sm:px-6 py-4">
        <ul class="flex flex-col gap-0.5">
          <li v-for="link in NAV_LINKS" :key="link.label">
            <NuxtLink
              :to="link.to"
              class="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#ff5811] hover:bg-gray-50 dark:hover:bg-[#161616] rounded transition group"
              active-class="!text-[#ff5811] bg-orange-50 dark:!bg-[#1a0f00]"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-[#ff5811] flex-shrink-0 transition" />
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
        <!-- mobile actions -->
        <div class="flex sm:hidden items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-[#222]">
          <button class="flex-1 text-xs font-bold px-4 h-9 border border-gray-900 dark:border-white text-gray-900 dark:text-white">
            Subscribe
          </button>
        </div>
      </nav>
    </div>

  </header>
</template>
