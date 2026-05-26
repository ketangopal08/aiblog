<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
const { $wp } = useNuxtApp()
const { open: openSearch } = useSearchModal()

const menuOpen = ref(false)

const CATEGORY_ICON  = 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z'
const CONTACT_ICON   = 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
const ADVERTISE_ICON = 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'

const { data: rawCategories } = await useAsyncData('nav-categories', () => $wp.getCategories())

const navLinks = [
  { label: 'News',     to: '/category/news' },
  { label: 'How-to',   to: '/category/how-to' },
  { label: 'Features', to: '/category/features' },
  { label: 'About Us', to: '/about' },
]

const staticDrawerLinks = [
  { label: 'Contact Us', to: '/contact',   icon: CONTACT_ICON },
  { label: 'Advertise',  to: '/advertise', icon: ADVERTISE_ICON },
]

const categoryDrawerLinks = computed(() =>
  (rawCategories.value ?? [])
    .filter((c: any) => c.slug !== 'uncategorized')
    .map((c: any) => ({ label: c.name, to: `/category/${c.slug}`, icon: CATEGORY_ICON }))
)

const route = useRoute()
watch(() => route.path, () => { menuOpen.value = false })
watch(menuOpen, (val) => {
  if (import.meta.client) document.body.style.overflow = val ? 'hidden' : ''
})

const scrolled = ref(false)
onMounted(() => {
  const onScroll = () => { scrolled.value = window.scrollY > 20 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <!-- ── Drawer backdrop & panel ── -->
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
        <div class="flex items-center justify-between px-5 h-14 border-b border-gray-100 dark:border-[#222] flex-shrink-0">
          <NuxtLink to="/" class="flex items-center gap-2" @click="menuOpen = false">
            <img src="/logo-dark.png" alt="" class="h-8 w-auto dark:hidden" />
            <img src="/logo-light.png" alt="" class="h-8 w-auto hidden dark:block" />
            <span class="text-base tracking-tight text-gray-900 dark:text-white" style="font-family: 'Playfair Display', serif !important; font-weight: 200 !important">NeuralBriefly</span>
          </NuxtLink>
          <button type="button" @click="menuOpen = false"
            class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            aria-label="Close menu">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto px-3 py-4">
          <!-- Static menu items -->
          <ul class="flex flex-col gap-0.5">
            <li v-for="link in staticDrawerLinks" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="flex items-center gap-3 px-3 py-3 text-base font-semibold
                       text-gray-700 dark:text-gray-300
                       hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1a1a1a]
                       rounded-lg transition group"
                style="font-family: 'Playfair Display', serif"
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

          <!-- Dynamic categories -->
          <template v-if="categoryDrawerLinks.length">
            <div class="mt-5 mb-2 px-3">
              <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Categories</span>
            </div>
            <ul class="flex flex-col gap-0.5">
              <li v-for="link in categoryDrawerLinks" :key="link.label">
                <NuxtLink
                  :to="link.to"
                  class="flex items-center gap-3 px-3 py-3 text-base font-semibold
                         text-gray-700 dark:text-gray-300
                         hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1a1a1a]
                         rounded-lg transition group"
                  active-class="!text-gray-900 dark:!text-white !bg-gray-100 dark:!bg-[#1a1a1a]"
                  style="font-family: 'Playfair Display', serif"
                >
                  <svg class="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition"
                       fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
                  </svg>
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </template>
        </nav>

        <div class="px-4 py-5 border-t border-gray-100 dark:border-[#222] flex flex-col gap-3 flex-shrink-0">
          <button type="button" class="w-full text-xs font-bold py-2.5 border border-primary
                         text-primary
                         hover:bg-primary hover:text-white
                         transition rounded">
            Subscribe
          </button>
          <button type="button" @click="toggleTheme"
            class="w-full flex items-center justify-center gap-2 text-xs font-semibold
                   text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition py-1">
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

  <!-- ── Mobile bar (< lg) ── -->
  <div class="lg:hidden sticky top-0 z-30 bg-white dark:bg-[#0D0D0D] border-b border-gray-100 dark:border-[#1a1a1a]">
    <div class="max-w-[1238px] mx-auto px-4">
      <div class="relative flex items-center h-14">
        <!-- Burger -->
        <button type="button" @click="menuOpen = !menuOpen" aria-label="Toggle menu"
          class="w-10 h-10 flex items-center justify-center text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition flex-shrink-0">
          <span class="flex flex-col gap-[5px]">
            <span class="block w-5 h-[1.5px] bg-current" />
            <span class="block w-5 h-[1.5px] bg-current" />
            <span class="block w-5 h-[1.5px] bg-current" />
          </span>
        </button>

        <span class="w-px h-5 bg-gray-300 dark:bg-[#333] mx-1" />

        <button type="button" aria-label="Search" @click="openSearch"
          class="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
          </svg>
        </button>

        <!-- Centre brand -->
        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
          <img src="/logo-dark.png" alt="" class="h-7 w-auto dark:hidden" />
          <img src="/logo-light.png" alt="" class="h-7 w-auto hidden dark:block" />
          <span class="text-[1.1rem] tracking-tight text-gray-900 dark:text-white" style="font-family: 'Playfair Display', serif !important; font-weight: 200 !important">NeuralBriefly</span>
        </NuxtLink>

        <!-- Right: theme + subscribe -->
        <div class="ml-auto flex items-center gap-2 flex-shrink-0">
          <button type="button" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'"
            class="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
            <svg v-if="!isDark" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4"/>
              <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </button>
          <button type="button" class="hidden sm:flex items-center text-xs font-bold px-4 h-9 border border-primary
                         text-primary
                         hover:bg-primary hover:text-white transition">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Desktop: unified sticky header ── -->
  <div class="hidden lg:block sticky top-0 z-30 bg-white dark:bg-[#0D0D0D] border-b border-gray-200 dark:border-white/[0.08]">

    <!-- Main bar -->
    <div
      class="max-w-[1238px] mx-auto flex items-stretch transition-all duration-300"
      :class="scrolled ? 'h-[65px] pt-0' : 'h-[80px] pt-[10px]'"
    >

      <!-- Brand: vertically centered on the left -->
      <NuxtLink to="/" class="flex items-center gap-3 flex-shrink-0 self-center">
        <img src="/logo-dark.png" alt="" class="h-9 w-auto dark:hidden" />
        <img src="/logo-light.png" alt="" class="h-9 w-auto hidden dark:block" />
        <span
          class="tracking-tight text-gray-900 dark:text-white leading-none transition-all duration-300"
          :style="scrolled
            ? 'font-size: 22px; font-family: Playfair Display, serif; font-weight: 200'
            : 'font-size: clamp(24px, 2.6vw, 36px); font-family: Playfair Display, serif; font-weight: 200'"
        >NeuralBriefly</span>
      </NuxtLink>

      <!-- Right column: two-row expanded → single-row compact on scroll -->
      <div
        class="ml-auto flex transition-all duration-300 overflow-hidden"
        :class="scrolled ? 'flex-row items-center gap-5' : 'flex-col items-end'"
      >

        <!-- Subscribe -->
        <button
          type="button"
          class="bg-primary text-white
                 px-4 h-[28px] text-[9px] font-black uppercase tracking-[2px]
                 hover:bg-primary/80 transition flex-shrink-0"
          :class="scrolled ? 'self-center' : ''"
        >
          Subscribe
        </button>

        <!-- Nav row -->
        <div class="nav-links flex items-center" :class="scrolled ? '' : 'flex-1'">

          <template v-for="(link, index) in navLinks" :key="link.label">
            <NuxtLink
              :to="link.to"
              class="text-[16px] font-semibold whitespace-nowrap
                     text-gray-600 dark:text-gray-300
                     hover:text-gray-900 dark:hover:text-white transition-colors"
              active-class="!text-gray-900 dark:!text-white"
            >
              {{ link.label }}
            </NuxtLink>
            <span class="text-gray-300 dark:text-white/20 mx-3 select-none text-[16px]">/</span>
          </template>

          <!-- Search -->
          <button type="button" aria-label="Search" @click="openSearch"
            class="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
            <svg class="w-[14px] h-[14px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
            </svg>
          </button>

          <!-- Theme toggle -->
          <button type="button" @click="toggleTheme"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            class="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
            <svg v-if="!isDark" class="w-[14px] h-[14px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4"/>
              <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else class="w-[14px] h-[14px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </button>

          <!-- Hamburger -->
          <button type="button" @click="menuOpen = !menuOpen" aria-label="Open menu"
            class="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
            <span class="flex flex-col gap-[5px]">
              <span class="block w-5 h-[1.5px] bg-current" />
              <span class="block w-5 h-[1.5px] bg-current" />
              <span class="block w-5 h-[1.5px] bg-current" />
            </span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }

.nav-links :deep(a) {
  font-family: 'Playfair Display', serif !important;
  font-size: 16px !important;
}
</style>
