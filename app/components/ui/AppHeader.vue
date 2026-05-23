<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
const { $wp } = useNuxtApp()

const menuOpen = ref(false)

const CATEGORY_ICON = 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z'
const HOME_ICON    = 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
const ABOUT_ICON   = 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'

const { data: rawCategories } = await useAsyncData('nav-categories', () => $wp.getCategories())

const navLinks = computed(() => {
  const cats = (rawCategories.value ?? [])
    .filter((c: any) => c.slug !== 'uncategorized')
    .map((c: any) => ({ label: c.name, to: `/category/${c.slug}` }))
  return [{ label: 'All', to: '/' }, ...cats, { label: 'About', to: '/about' }]
})

const drawerLinks = computed(() => {
  const cats = (rawCategories.value ?? [])
    .filter((c: any) => c.slug !== 'uncategorized')
    .map((c: any) => ({ label: c.name, to: `/category/${c.slug}`, icon: CATEGORY_ICON }))
  return [
    { label: 'All',   to: '/',       icon: HOME_ICON },
    ...cats,
    { label: 'About', to: '/about',  icon: ABOUT_ICON },
  ]
})

const route = useRoute()
watch(() => route.path, () => { menuOpen.value = false })

watch(menuOpen, (val) => {
  if (import.meta.client) document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<template>
  <!-- ── Drawer backdrop & panel (shared: mobile + desktop hamburger) ── -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="menuOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="menuOpen = false"
      />
    </Transition>

    <Transition name="slide">
      <div
        v-if="menuOpen"
        class="fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#0f0f0f]
               border-r border-gray-100 dark:border-[#222] z-50 flex flex-col shadow-2xl"
      >
        <!-- Drawer header -->
        <div class="flex items-center justify-between px-5 h-14 border-b border-gray-100 dark:border-[#222] flex-shrink-0">
          <NuxtLink to="/" class="flex items-center gap-2" @click="menuOpen = false">
            <img src="/logo-dark.png" alt="" class="h-8 w-auto dark:hidden" />
            <img src="/logo-light.png" alt="" class="h-8 w-auto hidden dark:block" />
            <span class="text-base font-black tracking-tight text-gray-900 dark:text-white" style="font-family: 'Inter', sans-serif !important">NeuralBriefly</span>
          </NuxtLink>
          <button
            type="button"
            @click="menuOpen = false"
            class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            aria-label="Close menu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Drawer nav links — same as desktop nav -->
        <nav class="flex-1 overflow-y-auto px-3 py-4">
          <ul class="flex flex-col gap-0.5">
            <li v-for="link in drawerLinks" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="flex items-center gap-3 px-3 py-3 text-sm font-semibold
                       text-gray-700 dark:text-gray-300
                       hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1a1a1a]
                       rounded-lg transition group"
                active-class="!text-gray-900 dark:!text-white !bg-gray-100 dark:!bg-[#1a1a1a]"
              >
                <svg class="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition"
                     fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
                </svg>
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Drawer footer -->
        <div class="px-4 py-5 border-t border-gray-100 dark:border-[#222] flex flex-col gap-3 flex-shrink-0">
          <button type="button" class="w-full text-xs font-bold py-2.5 border border-gray-900 dark:border-white
                         text-gray-900 dark:text-white
                         hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900
                         transition rounded">
            Subscribe
          </button>
          <button
            type="button"
            @click="toggleTheme"
            class="w-full flex items-center justify-center gap-2 text-xs font-semibold
                   text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition py-1"
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

  <!-- ── Mobile brand bar (< lg) ── -->
  <div class="lg:hidden bg-white dark:bg-[#0D0D0D] border-b border-gray-100 dark:border-[#1a1a1a]">
    <div class="max-w-[1158px] mx-auto px-4 sm:px-6 lg:px-8">
    <div class="relative flex items-center h-14">
      <!-- Left: burger -->
      <button
        type="button"
        @click="menuOpen = !menuOpen"
        aria-label="Toggle menu"
        class="w-10 h-10 flex items-center justify-center text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition flex-shrink-0"
      >
        <span class="flex flex-col gap-[5px]">
          <span class="block w-5 h-[1.5px] bg-current" />
          <span class="block w-5 h-[1.5px] bg-current" />
          <span class="block w-5 h-[1.5px] bg-current" />
        </span>
      </button>

      <span class="w-px h-5 bg-gray-300 dark:bg-[#333] mx-1" />

      <button type="button" aria-label="Search" class="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
        <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
      </button>

      <!-- Centre: logo -->
      <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
        <img src="/logo-dark.png" alt="" class="h-7 w-auto dark:hidden" />
        <img src="/logo-light.png" alt="" class="h-7 w-auto hidden dark:block" />
        <span class="text-[1.1rem] font-black tracking-tight text-gray-900 dark:text-white" style="font-family: 'Inter', sans-serif !important">NeuralBriefly</span>
      </NuxtLink>

      <!-- Right: theme + subscribe -->
      <div class="ml-auto flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          @click="toggleTheme"
          :title="isDark ? 'Light mode' : 'Dark mode'"
          class="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
        >
          <svg v-if="!isDark" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4"/>
            <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </button>
        <button type="button" class="hidden sm:flex items-center text-xs font-bold px-4 h-9 border border-gray-900 dark:border-white
                       text-gray-900 dark:text-white
                       hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition">
          Subscribe
        </button>
      </div>
    </div>
  </div>
</div>

  <!-- ── Desktop: utility bar (scrolls away) ── -->
  <div class="hidden lg:block bg-white dark:bg-[#0D0D0D] border-b border-gray-100 dark:border-white/[0.05]">
    <div class="max-w-[1158px] mx-auto flex items-center justify-end gap-1 py-2">
      <button type="button" aria-label="Search"
        class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
        <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
      </button>
      <button
        type="button"
        @click="toggleTheme"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
      >
        <svg v-if="!isDark" class="w-[15px] h-[15px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4"/>
          <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg v-else class="w-[15px] h-[15px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </button>
      <button
        type="button"
        class="text-[10px] font-black uppercase tracking-[2px]
               bg-gray-900 dark:bg-white text-white dark:text-gray-900
               px-5 py-1.5 hover:bg-gray-700 dark:hover:bg-gray-200 transition ml-2"
      >
        Subscribe
      </button>
    </div>
  </div>

  <!-- ── Desktop: main nav (sticky) ── -->
  <div class="hidden lg:block sticky top-0 z-30 bg-white dark:bg-[#0D0D0D] border-b border-gray-200 dark:border-white/10">
    <div class="max-w-[1158px] mx-auto">
      <nav class="flex items-center h-11">

        <!-- Brand -->
        <NuxtLink to="/" class="flex items-center gap-2 flex-shrink-0">
          <img src="/logo-dark.png" alt="" class="h-8 w-auto dark:hidden" />
          <img src="/logo-light.png" alt="" class="h-8 w-auto hidden dark:block" />
          <span class="text-[15px] font-black tracking-tight text-gray-900 dark:text-white" style="font-family: 'Inter', sans-serif !important">NeuralBriefly</span>
        </NuxtLink>

        <!-- Push everything else to the right -->
        <div class="ml-auto flex items-center">

          <!-- Slash-separated links -->
          <template v-for="link in navLinks" :key="link.label">
            <span class="mx-3 text-gray-300 dark:text-white/20 select-none text-base font-light leading-none">/</span>
            <NuxtLink
              :to="link.to"
              class="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap
                     text-gray-500 dark:text-gray-400
                     hover:text-gray-900 dark:hover:text-white transition-colors"
              active-class="!text-gray-900 dark:!text-white"
            >
              {{ link.label }}
            </NuxtLink>
          </template>

          <!-- Hamburger -->
          <button
            type="button"
            @click="menuOpen = !menuOpen"
            aria-label="Open menu"
            class="ml-3 w-9 h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <span class="flex flex-col gap-[5px]">
              <span class="block w-5 h-[1.5px] bg-current" />
              <span class="block w-5 h-[1.5px] bg-current" />
              <span class="block w-5 h-[1.5px] bg-current" />
            </span>
          </button>

        </div>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
