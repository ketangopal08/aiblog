# Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign theintelliprompt blog with Sora typography, a clean minimal aesthetic, an editorial masthead header, and a restructured homepage — touching only 6 files with zero changes to services, models, or composables.

**Architecture:** Pure visual layer restyle — all component script logic is preserved; only templates and config are changed. Tasks are ordered by dependency: config first, then leaf components (BlogCard, AppFooter), then AppHeader, then the homepage which consumes all of them.

**Tech Stack:** Nuxt 4, Tailwind CSS v3 (JIT), Vue 3 Composition API, TypeScript. No test framework — verification is `npm run build` (type/build check) and `npm run dev` (visual).

**Spec:** `docs/superpowers/specs/2026-03-15-blog-redesign-design.md`

---

## Chunk 1: Design System Foundations

### Task 1: Wire up Sora font

**Files:**
- Modify: `nuxt.config.ts`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Update `nuxt.config.ts` font links**

Replace the existing `app.head.link` array (currently one Lora entry) with:

```ts
// nuxt.config.ts
app: {
  head: {
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap',
      },
    ]
  }
}
```

- [ ] **Step 2: Update `tailwind.config.js` font family**

Delete the `fontFamily.serif` entry entirely and add `fontFamily.sans`. The full `theme.extend` block should read:

```js
theme: {
  extend: {
    fontFamily: {
      sans: ['Sora', 'sans-serif'],
    },
    colors: {
      primary: '#ff5811',
    },
  },
},
```

The `serif` key must be **deleted** (not left alongside sans) — Lora is no longer loaded, so keeping `font-serif` pointing to it would be a broken reference.

- [ ] **Step 3: Verify build passes**

```bash
cd /Users/ketangopalspectro/repos/aiblog && npm run build
```

Expected: build completes with no errors. Sora will not visually render until `npm run dev` is open in a browser.

- [ ] **Step 4: Commit**

```bash
git add nuxt.config.ts tailwind.config.js
git commit -m "feat: replace Lora with Sora font; wire up Google Fonts preconnect"
```

---

## Chunk 2: Leaf Components

### Task 2: Rewrite BlogCard

**Files:**
- Modify: `app/components/blog/BlogCard.vue`

The current `BlogCard.vue` has no `<script>` block — the component receives `post: PostModel` as a prop defined in the parent. Check the current file before writing.

- [ ] **Step 1: Replace `BlogCard.vue` with new template**

Write the complete file:

```vue
<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
defineProps<{ post: PostModel }>()
</script>

<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="group flex flex-col rounded-xl border border-gray-100 dark:border-[#222]
           bg-white dark:bg-[#161616] overflow-hidden
           hover:-translate-y-0.5
           hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]
           dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
           transition-all duration-200"
  >
    <!-- Image -->
    <div class="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-[#1f1f1f] flex-shrink-0">
      <img
        :src="post.featuredImage || `https://picsum.photos/seed/${post.id}/800/450`"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
      />
      <span class="absolute top-2.5 right-2.5 bg-black/50 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
        {{ post.readingTime }} min read
      </span>
    </div>

    <!-- Body -->
    <div class="flex flex-col flex-1 p-[18px] gap-2">
      <!-- Category -->
      <div class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
        <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          {{ post.categories[0]?.name ?? 'AI' }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-[15px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2
                 tracking-[-0.2px] group-hover:text-primary transition-colors">
        {{ post.title }}
      </h3>

      <!-- Excerpt -->
      <div
        class="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1"
        v-html="post.excerpt"
      />

      <!-- Footer -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#222]
                  text-[11px] text-gray-400 dark:text-gray-500 mt-auto">
        <span>{{ post.author.name }}</span>
        <span>{{ post.formattedDate }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: no TypeScript or build errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/blog/BlogCard.vue
git commit -m "feat: redesign BlogCard with Sora, minimal style, top-right reading time badge"
```

---

### Task 3: Rewrite AppFooter

**Files:**
- Modify: `app/components/ui/AppFooter.vue`

Key changes: remove newsletter form, reduce from 6 to 4 columns, apply new typography and spacing.

- [ ] **Step 1: Replace `AppFooter.vue` with new template**

```vue
<script setup lang="ts">
const COLUMNS = [
  {
    heading: 'AI Models',
    links: [
      { label: 'GPT Overview',       to: '/category/gpt' },
      { label: 'Prompt Engineering', to: '/category/gpt' },
      { label: 'GPT Use Cases',      to: '/category/gpt' },
      { label: 'OpenAI News',        to: '/category/gpt' },
    ],
  },
  {
    heading: 'Claude',
    links: [
      { label: 'Claude Guides',      to: '/category/claude' },
      { label: 'Claude vs Others',   to: '/category/claude' },
      { label: 'Anthropic News',     to: '/category/claude' },
      { label: 'Safety & Alignment', to: '/category/claude' },
    ],
  },
  {
    heading: 'Gemini',
    links: [
      { label: 'Gemini Basics',   to: '/category/gemini' },
      { label: 'Multimodal AI',   to: '/category/gemini' },
      { label: 'Google AI News',  to: '/category/gemini' },
      { label: 'Gemini vs GPT',   to: '/category/gemini' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',   to: '/about' },
      { label: 'Contact',    to: '/about' },
      { label: 'Newsletter', to: '/' },
      { label: 'Advertise',  to: '/about' },
    ],
  },
]
</script>

<template>
  <footer class="bg-[#0a0a0a] border-t border-[#1f1f1f]">
    <div class="max-w-[1200px] mx-auto px-8">

      <!-- Brand row -->
      <div class="flex justify-between items-start gap-10 pt-12 pb-10">
        <div>
          <NuxtLink to="/" class="text-[20px] font-black text-white tracking-tight">
            theintelli<span class="text-primary">prompt</span>
          </NuxtLink>
          <p class="text-[12px] text-[#555] mt-1.5">Your AI intelligence, daily.</p>

          <!-- Socials -->
          <div class="flex items-center gap-3 mt-4">
            <a href="#" aria-label="X / Twitter"
               class="w-8 h-8 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-white hover:border-white transition">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram"
               class="w-8 h-8 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-white hover:border-white transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook"
               class="w-8 h-8 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-white hover:border-white transition">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Link columns -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 py-9 border-b border-[#1a1a1a]">
        <div v-for="col in COLUMNS" :key="col.heading">
          <h4 class="text-[10px] font-bold text-white uppercase tracking-[2px] mb-3.5">
            {{ col.heading }}
          </h4>
          <ul class="flex flex-col">
            <li v-for="link in col.links" :key="link.label">
              <NuxtLink :to="link.to" class="block text-[12px] text-[#555] hover:text-white transition mb-2.5">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="text-center text-[11px] text-[#3a3a3a] py-6">
        &copy; {{ new Date().getFullYear() }} theintelliprompt. All Rights Reserved.
        <a href="#" class="hover:text-[#666] transition ml-2">Terms of Service</a>
        <a href="#" class="hover:text-[#666] transition ml-2">Privacy Policy</a>
      </div>

    </div>
  </footer>
</template>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/ui/AppFooter.vue
git commit -m "feat: redesign AppFooter — 4-col layout, remove newsletter form, Sora typography"
```

---

## Chunk 3: AppHeader

### Task 4: Rewrite AppHeader with editorial masthead + scroll detection

**Files:**
- Modify: `app/components/ui/AppHeader.vue`

Key changes: add desktop editorial masthead (hidden on mobile), add scroll sentinel + IntersectionObserver, split NAV_LINKS / DRAWER_LINKS, update sticky nav template.

- [ ] **Step 1: Replace `AppHeader.vue` with new implementation**

```vue
<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

const menuOpen = ref(false)

// Desktop sticky nav — label + route only (no icons)
const NAV_LINKS = [
  { label: 'All',    to: '/' },
  { label: 'GPT',    to: '/category/gpt' },
  { label: 'Gemini', to: '/category/gemini' },
  { label: 'Claude', to: '/category/claude' },
  { label: 'AI',     to: '/category/ai' },
  { label: 'About',  to: '/about' },
]

// Mobile drawer — label + route + icon
const DRAWER_LINKS = [
  { label: 'Home',   to: '/',               icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'GPT',    to: '/category/gpt',   icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { label: 'Gemini', to: '/category/gemini',icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { label: 'Claude', to: '/category/claude',icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { label: 'AI',     to: '/category/ai',    icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18' },
  { label: 'About',  to: '/about',          icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

// Scroll detection: show logo in sticky nav once masthead scrolls away
const mastheadSentinel = ref<HTMLElement | null>(null)
const mastheadVisible = ref(true)

onMounted(() => {
  if (!mastheadSentinel.value) return
  const observer = new IntersectionObserver(
    ([entry]) => { mastheadVisible.value = entry.isIntersecting },
    { rootMargin: '0px', threshold: 0 }
  )
  observer.observe(mastheadSentinel.value)
  onUnmounted(() => observer.disconnect())
})

const route = useRoute()
watch(() => route.path, () => { menuOpen.value = false })

watch(menuOpen, (val) => {
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})
</script>

<template>
  <!-- ── Drawer backdrop & panel (Teleport, mobile) ── -->
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
          <NuxtLink to="/" class="text-base font-black tracking-tight text-gray-900 dark:text-white" @click="menuOpen = false">
            theintelli<span class="text-primary">prompt</span>
          </NuxtLink>
          <button
            @click="menuOpen = false"
            class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary transition"
            aria-label="Close menu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Drawer nav links -->
        <nav class="flex-1 overflow-y-auto px-3 py-4">
          <ul class="flex flex-col gap-0.5">
            <li v-for="link in DRAWER_LINKS" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="flex items-center gap-3 px-3 py-3 text-sm font-semibold
                       text-gray-700 dark:text-gray-300
                       hover:text-primary hover:bg-gray-50 dark:hover:bg-[#1a1a1a]
                       rounded-lg transition group"
                active-class="!text-primary !bg-orange-50 dark:!bg-[#1a0f00]"
              >
                <svg class="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-primary transition"
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
          <button class="w-full text-xs font-bold py-2.5 border border-gray-900 dark:border-white
                         text-gray-900 dark:text-white
                         hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900
                         transition rounded">
            Subscribe
          </button>
          <button
            @click="toggleTheme"
            class="w-full flex items-center justify-center gap-2 text-xs font-semibold
                   text-gray-500 dark:text-gray-400 hover:text-primary transition py-1"
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

  <!-- ── Mobile brand bar (always visible on < lg) ── -->
  <div class="bg-white dark:bg-[#0D0D0D] border-b border-gray-100 dark:border-[#1a1a1a]">
    <div class="relative flex items-center h-14 px-4 sm:px-6">
      <!-- Left: burger -->
      <button
        @click="menuOpen = !menuOpen"
        aria-label="Toggle menu"
        class="w-10 h-10 flex items-center justify-center text-gray-800 dark:text-gray-100 hover:text-primary transition flex-shrink-0"
      >
        <span class="flex flex-col gap-[5px]">
          <span class="block w-5 h-[1.5px] bg-current transition-all duration-300" />
          <span class="block w-5 h-[1.5px] bg-current transition-all duration-300" />
          <span class="block w-5 h-[1.5px] bg-current transition-all duration-300" />
        </span>
      </button>

      <span class="w-px h-5 bg-gray-300 dark:bg-[#333] mx-1" />

      <button aria-label="Search" class="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary transition">
        <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
      </button>

      <!-- Centre: logo -->
      <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 select-none whitespace-nowrap">
        <span class="text-[1.2rem] font-black tracking-tight leading-none text-gray-900 dark:text-white">
          theintelli<span class="text-primary">prompt</span>
        </span>
      </NuxtLink>

      <!-- Right: theme + subscribe -->
      <div class="ml-auto flex items-center gap-2 flex-shrink-0">
        <button
          @click="toggleTheme"
          :title="isDark ? 'Light mode' : 'Dark mode'"
          class="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary transition"
        >
          <svg v-if="!isDark" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4"/>
            <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </button>
        <button class="hidden sm:flex items-center text-xs font-bold px-4 h-9 border border-gray-900 dark:border-white
                       text-gray-900 dark:text-white
                       hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition">
          Subscribe
        </button>
      </div>
    </div>
  </div>

  <!-- ── Desktop editorial masthead (scrolls away, lg+ only) ── -->
  <div class="hidden lg:block bg-white dark:bg-[#0D0D0D] border-b border-gray-100 dark:border-[#1a1a1a] pt-7 pb-0 text-center">
    <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-[4px] mb-2.5">
      Your AI Intelligence, Daily
    </p>
    <NuxtLink
      to="/"
      class="text-[38px] font-black text-gray-900 dark:text-white tracking-[-1.5px] leading-none inline-block mb-5"
    >
      theintelli<span class="text-primary">prompt</span>
    </NuxtLink>
    <!-- Sentinel: IntersectionObserver watches this to know when masthead leaves viewport -->
    <div ref="mastheadSentinel" class="h-px" />
  </div>

  <!-- ── Desktop sticky nav bar (lg+ only) ── -->
  <nav class="hidden lg:flex items-center justify-between
              bg-white dark:bg-[#0D0D0D]
              border-b border-gray-200 dark:border-[#222]
              sticky top-0 z-30 px-6">

    <!-- Left: logo fades in once masthead scrolls away -->
    <Transition name="fade">
      <NuxtLink
        v-if="!mastheadVisible"
        to="/"
        class="text-[15px] font-black text-gray-900 dark:text-white tracking-tight py-2 mr-4 flex-shrink-0"
      >
        theintelli<span class="text-primary">prompt</span>
      </NuxtLink>
    </Transition>

    <!-- Centre: nav links -->
    <div class="flex items-center flex-1 justify-center">
      <NuxtLink
        v-for="link in NAV_LINKS"
        :key="link.label"
        :to="link.to"
        class="px-4 h-11 flex items-center text-[11px] font-bold uppercase tracking-wider
               text-gray-600 dark:text-gray-300
               border-b-2 border-transparent
               hover:text-primary transition-colors"
        active-class="!text-primary !border-primary"
      >
        {{ link.label }}
      </NuxtLink>
    </div>

    <!-- Right: actions -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <button class="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition">
        <svg class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
      </button>
      <button
        @click="toggleTheme"
        class="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition"
      >
        <svg v-if="!isDark" class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4"/>
          <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg v-else class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </button>
      <button class="bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full hover:bg-orange-600 transition">
        Subscribe
      </button>
    </div>
  </nav>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: no TypeScript or build errors.

- [ ] **Step 3: Visual check in dev server**

```bash
npm run dev
```

Open `http://localhost:3000` in browser. Verify:
- Desktop: big centred masthead with tagline visible on page load
- Desktop: scroll down → masthead disappears, sticky nav stays; logo fades in on left
- Mobile: compact brand bar only; burger opens drawer with icons
- Dark mode toggle works in both sticky nav (desktop) and drawer (mobile)

- [ ] **Step 4: Commit**

```bash
git add app/components/ui/AppHeader.vue
git commit -m "feat: redesign AppHeader — editorial masthead, scroll-aware sticky nav, split NAV_LINKS/DRAWER_LINKS"
```

---

## Chunk 4: Homepage

### Task 5: Rewrite index.vue

**Files:**
- Modify: `app/pages/index.vue`

Key changes: remove carousel + more-news sections, add hero 3-col grid, latest posts grid, newsletter CTA band. Computed properties `listPosts` and `latestPosts` replace the removed ones.

- [ ] **Step 1: Replace `index.vue` with restructured page**

```vue
<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const { $wp } = useNuxtApp()

const allPosts = ref<PostModel[]>([])
const featuredPost = ref<PostModel | null>(null)
const { fetchCategories } = useCategories()

const FEATURED_SLUG = 'claude-constitutional-ai-explained'

await Promise.all([
  fetchCategories(),
  (async () => { allPosts.value = await $wp.getPosts(1, 20) as PostModel[] })(),
  (async () => { featuredPost.value = await $wp.getPostBySlug(FEATURED_SLUG) as PostModel | null })(),
])

if (!featuredPost.value) featuredPost.value = allPosts.value[0] ?? null

const remainingPosts = computed(() =>
  allPosts.value.filter(p => p.slug !== FEATURED_SLUG)
)

const sideCards   = computed(() => remainingPosts.value.slice(0, 2))
const listPosts   = computed(() => remainingPosts.value.slice(2, 6))
const latestPosts = computed(() => remainingPosts.value.slice(6, 12))

function postImg(post: PostModel, w = 800, h = 500) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/${w}/${h}`
}
</script>

<template>
  <div class="bg-white dark:bg-[#0D0D0D]">
    <SeoHead :seo="{ title: 'AI Blog – Home', description: 'Latest articles on GPT, Gemini, Claude and the AI world.' }" />

    <div class="max-w-[1200px] mx-auto px-8 pt-8 pb-16">

      <!-- ══════════════════════════════════
           HERO: 3-col grid
      ══════════════════════════════════ -->
      <section class="mb-2">
        <div class="grid grid-cols-1 lg:grid-cols-[5fr_3.5fr_2.5fr] gap-4 items-stretch">

          <!-- Col 1: Big hero card -->
          <div v-if="!featuredPost" class="rounded-2xl animate-pulse bg-gray-200 dark:bg-[#1f1f1f] min-h-[440px]" />
          <NuxtLink
            v-else
            :to="`/blog/${featuredPost.slug}`"
            class="relative block rounded-2xl overflow-hidden group bg-gray-200 dark:bg-[#1f1f1f] min-h-[440px]"
          >
            <img
              :src="postImg(featuredPost, 1200, 700)"
              :alt="featuredPost.title"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/88 via-black/30 to-black/10" />
            <div class="absolute bottom-0 left-0 right-0 p-7">
              <span class="block text-[10px] font-extrabold uppercase tracking-widest text-white mb-3">
                {{ featuredPost.categories[0]?.name ?? 'AI' }}
              </span>
              <h1 class="text-[26px] font-extrabold text-white leading-tight mb-3 line-clamp-3 tracking-tight">
                {{ featuredPost.title }}
              </h1>
              <p class="text-sm text-white/50 font-medium">{{ featuredPost.formattedDate }}</p>
            </div>
          </NuxtLink>

          <!-- Col 2: 2 stacked cards -->
          <div class="flex flex-col gap-4">
            <template v-if="!sideCards.length">
              <div v-for="n in 2" :key="n" class="flex-1 rounded-2xl animate-pulse bg-gray-200 dark:bg-[#1f1f1f] min-h-[200px]" />
            </template>
            <template v-else>
              <NuxtLink
                v-for="post in sideCards"
                :key="post.id"
                :to="`/blog/${post.slug}`"
                class="relative flex-1 rounded-2xl overflow-hidden group bg-gray-200 dark:bg-[#1f1f1f] min-h-[200px]"
              >
                <img
                  :src="postImg(post, 600, 400)"
                  :alt="post.title"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/82 via-black/15 to-transparent" />
                <div class="absolute bottom-0 left-0 right-0 p-[18px]">
                  <span class="block text-[9px] font-extrabold text-white uppercase tracking-widest mb-1.5">
                    {{ post.categories[0]?.name ?? 'AI' }}
                  </span>
                  <h3 class="text-[15px] font-bold text-white leading-snug line-clamp-2 mb-1">
                    {{ post.title }}
                  </h3>
                  <p class="text-[11px] text-white/50">{{ post.formattedDate }}</p>
                </div>
              </NuxtLink>
            </template>
          </div>

          <!-- Col 3: Thumbnail list -->
          <div class="flex flex-col border-l border-gray-100 dark:border-[#222] pl-5">
            <template v-if="!listPosts.length">
              <div
                v-for="n in 4" :key="n"
                class="flex gap-3 py-3.5 border-b border-gray-100 dark:border-[#222] last:border-b-0 animate-pulse"
              >
                <div class="w-[72px] h-[56px] rounded-lg bg-gray-200 dark:bg-[#1f1f1f] flex-shrink-0" />
                <div class="flex-1 space-y-2 pt-1">
                  <div class="h-2 bg-gray-200 dark:bg-[#1f1f1f] rounded w-1/3" />
                  <div class="h-3 bg-gray-200 dark:bg-[#1f1f1f] rounded w-full" />
                  <div class="h-3 bg-gray-200 dark:bg-[#1f1f1f] rounded w-2/3" />
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink
                v-for="post in listPosts"
                :key="post.id"
                :to="`/blog/${post.slug}`"
                class="flex gap-3 items-start py-3.5 border-b border-gray-100 dark:border-[#222] last:border-b-0 first:pt-0 group"
              >
                <div class="w-[72px] h-[56px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-[#1f1f1f]">
                  <img
                    :src="postImg(post, 200, 150)"
                    :alt="post.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[9px] font-extrabold text-primary uppercase tracking-widest mb-1">
                    {{ post.categories[0]?.name ?? 'AI' }}
                  </p>
                  <p class="text-[13px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {{ post.title }}
                  </p>
                  <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium">
                    {{ post.formattedDate }}
                  </p>
                </div>
              </NuxtLink>
            </template>
          </div>

        </div>
      </section>

      <!-- ══════════════════════════════════
           LATEST POSTS
      ══════════════════════════════════ -->
      <section v-if="latestPosts.length">
        <div class="flex items-center gap-4 my-9">
          <h2 class="text-[12px] font-extrabold uppercase tracking-[2px] text-gray-900 dark:text-white whitespace-nowrap">
            Latest Posts
          </h2>
          <div class="flex-1 h-px bg-gray-100 dark:bg-[#222]" />
          <NuxtLink to="/" class="text-[11px] font-bold text-primary uppercase tracking-widest">
            View All →
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-11">
          <BlogCard v-for="post in latestPosts" :key="post.id" :post="post" />
        </div>
      </section>

      <!-- ══════════════════════════════════
           NEWSLETTER CTA
      ══════════════════════════════════ -->
      <div class="bg-[#111] dark:bg-[#0a0a0a] rounded-2xl px-12 py-10
                  flex flex-col lg:flex-row items-center justify-between gap-8 mb-14">
        <div>
          <h3 class="text-[22px] font-extrabold text-white tracking-tight mb-1.5">
            Stay ahead of AI.
          </h3>
          <p class="text-[13px] text-gray-500">
            Weekly digest of the most important developments across GPT, Claude, Gemini and beyond.
          </p>
        </div>
        <form class="flex gap-2 flex-shrink-0" @submit.prevent>
          <input
            type="email"
            placeholder="your@email.com"
            class="font-sans text-[13px] bg-[#1e1e1e] border border-[#2d2d2d]
                   text-white placeholder-[#555] px-5 py-3 rounded-lg outline-none
                   w-60 focus:border-gray-500 transition"
          />
          <button
            type="submit"
            class="font-sans text-[12px] font-bold bg-primary text-white
                   px-5 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Subscribe →
          </button>
        </form>
      </div>

    </div>
  </div>
</template>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: clean build, no TypeScript errors.

- [ ] **Step 3: Full visual verification in dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- **Hero grid** renders: big card left, 2 stacked middle, thumbnail list right (with left border)
- **Category labels on overlay cards** are white (not orange) — per CLAUDE.md rule
- **Category labels in thumbnail list** are orange (`text-primary`)
- **Skeletons** show while posts are loading
- **Latest Posts grid** shows 3-col BlogCards with hover lift
- **Newsletter band** is dark, full width, responsive (stacks on mobile)
- **Carousel and More News sections** are gone
- **Dark mode** toggle switches the page correctly
- **Footer** shows 4 columns, no newsletter form

- [ ] **Step 4: Commit**

```bash
git add app/pages/index.vue
git commit -m "feat: restructure homepage — 3-col hero grid, latest posts, newsletter CTA; remove carousel"
```

---

## Final Checklist

- [ ] `npm run build` passes with no errors
- [ ] Sora font loads in browser (check Network tab — should see `fonts.googleapis.com` request)
- [ ] Desktop masthead scrolls away, logo fades into sticky nav
- [ ] Mobile burger drawer opens with icons; desktop nav shows text-only links
- [ ] Dark mode works across all redesigned components
- [ ] No raw hex values used in templates (only Tailwind tokens + allowed exceptions)
- [ ] No `font-serif` classes remain in any template (Lora is gone)
