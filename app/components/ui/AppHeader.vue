<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

const menuOpen = ref(false)

const NAV_LINKS = [
  { label: 'Home',    to: '/',                icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'About',   to: '/about',           icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'GPT',     to: '/category/gpt',    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { label: 'Gemini',  to: '/category/gemini', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { label: 'Claude',  to: '/category/claude', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { label: 'AI',      to: '/category/ai',     icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18' },
  { label: 'Contact', to: '/about',           icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
]

const route = useRoute()
watch(() => route.path, () => { menuOpen.value = false })

// lock body scroll when drawer open
watch(menuOpen, (val) => {
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})
</script>

<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="menuOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="menuOpen = false"
      />
    </Transition>

    <!-- Left drawer -->
    <Transition name="slide">
      <div
        v-if="menuOpen"
        class="fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#0f0f0f] border-r border-gray-100 dark:border-[#222] z-50 flex flex-col shadow-2xl"
      >
        <!-- Drawer header -->
        <div class="flex items-center justify-between px-5 h-14 border-b border-gray-100 dark:border-[#222] flex-shrink-0">
          <NuxtLink to="/" class="text-base font-black tracking-tight text-gray-900 dark:text-white" @click="menuOpen = false">
            theintelli<span style="color:#ff5811">prompt</span>
          </NuxtLink>
          <button
            @click="menuOpen = false"
            class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#ff5811] transition"
            aria-label="Close menu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Nav links -->
        <nav class="flex-1 overflow-y-auto px-3 py-4">
          <ul class="flex flex-col gap-0.5">
            <li v-for="link in NAV_LINKS" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#ff5811] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] rounded-lg transition group"
                active-class="!text-[#ff5811] !bg-orange-50 dark:!bg-[#1a0f00]"
              >
                <svg class="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-[#ff5811] transition" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
                </svg>
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Drawer footer -->
        <div class="px-4 py-5 border-t border-gray-100 dark:border-[#222] flex flex-col gap-3 flex-shrink-0">
          <button class="w-full text-xs font-bold py-2.5 border border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition rounded">
            Subscribe
          </button>
          <!-- theme toggle -->
          <button
            @click="toggleTheme"
            class="w-full flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#ff5811] transition py-1"
          >
            <svg v-if="!isDark" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4"/>
              <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
            {{ isDark ? 'Light mode' : 'Dark mode' }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>

  <header class="bg-white dark:bg-[#0D0D0D] border-b border-gray-200 dark:border-[#222222] sticky top-0 z-30">
    <div class="relative flex items-center h-14 px-4 sm:px-6">

      <!-- LEFT: burger | divider | search -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <button
          @click="menuOpen = !menuOpen"
          aria-label="Toggle menu"
          class="w-10 h-10 flex items-center justify-center text-gray-800 dark:text-gray-100 hover:text-[#ff5811] transition"
        >
          <span class="flex flex-col gap-[5px]">
            <span class="block w-5 h-[1.5px] bg-current transition-all duration-300" />
            <span class="block w-5 h-[1.5px] bg-current transition-all duration-300" />
            <span class="block w-5 h-[1.5px] bg-current transition-all duration-300" />
          </span>
        </button>

        <span class="w-px h-5 bg-gray-300 dark:bg-[#333] mx-1" />

        <button aria-label="Search" class="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#ff5811] transition">
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7"/>
            <path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
          </svg>
        </button>
      </div>

      <!-- CENTER: logo -->
      <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 select-none whitespace-nowrap">
        <span class="text-[1.35rem] font-black tracking-tight leading-none text-gray-900 dark:text-white">
          theintelliprompt
        </span>
      </NuxtLink>

      <!-- RIGHT: theme toggle + Subscribe -->
      <div class="ml-auto flex items-center gap-2 flex-shrink-0">
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

        <button class="hidden sm:flex items-center text-xs font-bold px-4 h-9 border border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition">
          Subscribe
        </button>
      </div>

    </div>
  </header>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
