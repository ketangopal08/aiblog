# Blog Redesign Design Spec
**Date:** 2026-03-15
**Project:** theintelliprompt (Nuxt 4 + Tailwind CSS + WordPress REST API)
**Scope:** Option 2 — Restyle + Homepage Restructure

---

## 1. Design System

### Aesthetic Direction
Clean & Minimal — white/light background, generous whitespace, restrained orange accents, modern card borders.

### Typography
**Font:** Sora (Google Fonts), replacing Lora.

**Two files must change:**

**`nuxt.config.ts`** — replace the entire `app.head.link` array with:
```ts
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

**`tailwind.config.js`** — **delete** the existing `fontFamily.serif` entry entirely and add `fontFamily.sans`:
```js
fontFamily: {
  // DELETE: serif: ['Lora', 'Georgia', 'serif'],  ← remove this line
  sans: ['Sora', 'sans-serif'],
},
```
The `serif` key must be removed so `font-serif` no longer maps to Lora (which will no longer be loaded). Adding `sans` without removing `serif` would leave a broken `font-serif` mapping. The project uses Tailwind v3 JIT mode (via `@nuxtjs/tailwindcss`) which supports the arbitrary `fr` column values used in §3.

**Weights used:** 400, 500, 600, 700, 800, 900.

### Color Tokens (unchanged)
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#ff5811` | Links, active nav underline, subscribe button, category dots, list category labels |
| `text-gray-900` / `#111` | Dark | Headings, body text (light mode) |
| `bg-white` / `#fafafa` | Light | Page background |
| `#0a0a0a` | Near-black | Footer background |

### Category Label Rules (per CLAUDE.md)
- **On image overlays (dark bg):** category text uses `text-white` — NOT `text-primary`. Applies to the big hero card (col 1) and two stacked mid cards (col 2).
- **On white/light backgrounds:** category text uses `text-primary`. Applies to the thumbnail list (col 3 hero) and post cards.

### Dark Mode
- Light mode is the **default**.
- Dark mode toggled via existing `useTheme()` composable — behaviour unchanged.
- All new component templates must include `dark:` Tailwind variants as specified below.

### Container & Spacing
- Page max-width: `max-w-[1200px]` (replacing current `max-w-7xl` = 1280px — applies to all sections including header and footer)
- Horizontal padding: `px-8` (32px)
- Card border radius: `rounded-xl` (12px) for post cards; `rounded-2xl` (16px) for hero cards and newsletter band
- Card border: `border border-gray-100 dark:border-[#222]`

---

## 2. Header — Editorial Masthead

### Responsive Strategy
- **Mobile (< lg):** Show a compact centred logo bar (`h-14`) only — identical structure to the current Row 1 brand bar. The desktop masthead block (tagline + large title) is hidden via `hidden lg:block`.
- **Desktop (lg+):** Show full masthead (tagline + large title) that scrolls away, then a sticky nav bar that stays at the top.

### Masthead (desktop only — `lg:block hidden` wrapper)
```html
<div class="hidden lg:block bg-white dark:bg-[#0D0D0D] border-b border-gray-100 dark:border-[#1a1a1a] pt-7 pb-0 text-center">
  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-[4px] mb-2.5">
    Your AI Intelligence, Daily
  </p>
  <NuxtLink to="/" class="text-[38px] font-black text-gray-900 dark:text-white tracking-[-1.5px] leading-none inline-block mb-5">
    theintelli<span class="text-primary">prompt</span>
  </NuxtLink>
  <!-- Scroll sentinel — IntersectionObserver watches this -->
  <div ref="mastheadSentinel" class="h-px" />
</div>
```

### Scroll Detection
Add to `<script setup>`:
```ts
const mastheadSentinel = ref<HTMLElement | null>(null)
const mastheadVisible = ref(true)  // starts true (masthead in view on load)

onMounted(() => {
  if (!mastheadSentinel.value) return
  const observer = new IntersectionObserver(
    ([entry]) => { mastheadVisible.value = entry.isIntersecting },
    { rootMargin: '0px', threshold: 0 }
  )
  observer.observe(mastheadSentinel.value)
  onUnmounted(() => observer.disconnect())
})
```

### Sticky Nav Bar (desktop `lg:flex`, hidden below lg)
Full template for the sticky bar (replaces current `<nav class="hidden lg:flex ...">` at line 160):
```html
<nav class="hidden lg:flex items-center justify-between
            bg-white dark:bg-[#0D0D0D]
            border-b border-gray-200 dark:border-[#222]
            sticky top-0 z-30 px-6">

  <!-- Left: logo — only visible once masthead has scrolled away -->
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
    <!-- search icon -->
    <button class="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition">
      <svg class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
      </svg>
    </button>
    <!-- theme toggle -->
    <button @click="toggleTheme" class="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition">
      <svg v-if="!isDark" class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4"/>
        <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
      <svg v-else class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
      </svg>
    </button>
    <!-- subscribe -->
    <button class="bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full hover:bg-orange-600 transition">
      Subscribe
    </button>
  </div>
</nav>
```

Fade transition (add to `<style scoped>`):
```css
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
```

### Updated `NAV_LINKS` array
Replace the existing 7-item array. Desktop nav uses `label` + `to` only. Drawer nav (mobile) uses `label`, `to`, and `icon`. Keep the two arrays separate:

```ts
// Used by sticky desktop nav
const NAV_LINKS = [
  { label: 'All',    to: '/' },
  { label: 'GPT',    to: '/category/gpt' },
  { label: 'Gemini', to: '/category/gemini' },
  { label: 'Claude', to: '/category/claude' },
  { label: 'AI',     to: '/category/ai' },
  { label: 'About',  to: '/about' },
]

// Used by mobile drawer only (keeps icons)
const DRAWER_LINKS = [
  { label: 'Home',    to: '/',               icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'GPT',     to: '/category/gpt',   icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { label: 'Gemini',  to: '/category/gemini',icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { label: 'Claude',  to: '/category/claude',icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { label: 'AI',      to: '/category/ai',    icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18' },
  { label: 'About',   to: '/about',          icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]
```

The drawer template iterates `DRAWER_LINKS`; the sticky nav iterates `NAV_LINKS`.

### Mobile brand bar (< lg, always visible)
Keep the existing Row 1 structure (burger + search + centred logo + theme toggle + Subscribe). Update the logo text to match new Sora font (automatic via Tailwind override). No other changes to mobile header.

### Script additions (summary)
Add to `<script setup>` in `AppHeader.vue`:
- `mastheadSentinel` ref
- `mastheadVisible` ref (initial: `true`)
- `IntersectionObserver` setup in `onMounted` / teardown in `onUnmounted`
- Replace `NAV_LINKS` with `NAV_LINKS` + `DRAWER_LINKS` as above

Keep unchanged: `isDark`, `toggleTheme`, `menuOpen`, route watcher, body scroll lock.

---

## 3. Homepage (`index.vue`) — Full Restructure

### Data / Computed Changes
**Remove:**
- `horizontalPosts`, `moreNewsPosts`, `popularPosts`
- `carouselIndex`, `visibleCards`, `carouselPosts`
- `prevSlide()`, `nextSlide()`

**Add:**
```ts
// Col 3 of hero grid — 4 thumbnail list items
const listPosts = computed(() => remainingPosts.value.slice(2, 6))

// Latest Posts card grid — up to 6 posts
const latestPosts = computed(() => remainingPosts.value.slice(6, 12))
```

**Keep unchanged:** `allPosts`, `featuredPost`, `sideCards` (slice 0–1), `remainingPosts`, `FEATURED_SLUG`, `postImg()`, `fetchCategories`.

**Post count note:** The existing `$wp.getPosts(1, 20)` fetches 20 posts. With 1 as featured, `remainingPosts` has up to 19. Sections consume: sideCards (2) + listPosts (4) + latestPosts (6) = 12. 20 is sufficient — do not change the fetch size.

### Section 1: Hero Grid

**Tailwind grid class:** `grid grid-cols-1 lg:grid-cols-[5fr_3.5fr_2.5fr] gap-4 items-stretch`
(Tailwind v3 JIT supports decimal `fr` values in arbitrary grid-cols.)

**Col 1 — Big Hero Card** (`featuredPost`)
- Container: `relative block rounded-2xl overflow-hidden group bg-gray-200 dark:bg-[#1f1f1f] min-h-[440px]`
- Image: `absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700`
- Overlay: `absolute inset-0 bg-gradient-to-t from-black/88 via-black/30 to-black/10`
- Skeleton (v-if loading): `rounded-2xl animate-pulse bg-gray-200 dark:bg-[#1f1f1f] min-h-[440px]`
- Content (`absolute bottom-0 left-0 right-0 p-7`):
  - Category: `block text-[10px] font-extrabold uppercase tracking-widest text-white mb-3` ← `text-white` (overlay rule)
  - Title: `text-[26px] font-extrabold text-white leading-tight mb-3 line-clamp-3 tracking-tight`
  - Date: `text-sm text-white/50 font-medium`

**Col 2 — 2 Stacked Cards** (`sideCards`)
- Wrapper: `flex flex-col gap-4`
- Each card: `relative flex-1 rounded-2xl overflow-hidden group bg-gray-200 dark:bg-[#1f1f1f] min-h-[200px]`
- Skeleton: `flex-1 rounded-2xl animate-pulse bg-gray-200 dark:bg-[#1f1f1f] min-h-[200px]`
- Image: `absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700`
- Overlay: `absolute inset-0 bg-gradient-to-t from-black/82 via-black/15 to-transparent`
- Content (`absolute bottom-0 left-0 right-0 p-[18px]`):
  - Category: `block text-[9px] font-extrabold text-white uppercase tracking-widest mb-1.5` ← `text-white` (overlay rule)
  - Title: `text-[15px] font-bold text-white leading-snug line-clamp-2 mb-1`
  - Date: `text-[11px] text-white/50`

**Col 3 — Thumbnail List** (`listPosts`, 4 items)
- Wrapper: `flex flex-col border-l border-gray-100 dark:border-[#222] pl-5`
- Skeleton: 4× `flex gap-3 py-3.5 border-b border-gray-100 dark:border-[#222] animate-pulse`
- Each item: `NuxtLink flex gap-3 items-start py-3.5 border-b border-gray-100 dark:border-[#222] last:border-b-0 first:pt-0 group`
- Thumbnail: `w-[72px] h-[56px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-[#1f1f1f]`
  - Image: `w-full h-full object-cover group-hover:scale-105 transition-transform duration-300`
- Body:
  - Category: `text-[9px] font-extrabold text-primary uppercase tracking-widest mb-1` ← `text-primary`
  - Title: `text-[13px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors`
  - Date: `text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium`

### Section 2: Latest Posts Grid

**Section header row:**
```html
<div class="flex items-center gap-4 my-9">
  <h2 class="text-[12px] font-extrabold uppercase tracking-[2px] text-gray-900 dark:text-white whitespace-nowrap">
    Latest Posts
  </h2>
  <div class="flex-1 h-px bg-gray-100 dark:bg-[#222]" />
  <NuxtLink to="/" class="text-[11px] font-bold text-primary uppercase tracking-widest">
    View All →
  </NuxtLink>
</div>
```

**Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-11`

Uses `<BlogCard :post="post" />` for each item in `latestPosts`. If `latestPosts` is empty (< 7 posts fetched), the section renders nothing — acceptable.

### Section 3: Newsletter CTA Band

```html
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
```

- `@submit.prevent` — no-op, UI only, no success/error state required.
- No `dark:` variants needed on text inside this band — it is always on a dark background in both modes.

### Removed sections
- Founders Corner carousel — **fully removed**
- More News 3-col section — **fully removed**

---

## 4. BlogCard Component Redesign

**File:** `app/components/blog/BlogCard.vue`

**Props:** unchanged — `{ post: PostModel }`. `post.author.name` is always a string (confirmed by existing usage in `index.vue`; no null-guard needed).

**Reading time badge position:** moved to **top-right** of image (was bottom-right in current implementation). This is intentional.

### Template structure
```
[Image 16:9 — rounded-t-xl, overflow-hidden]
  [Reading time badge — absolute top-2.5 right-2.5]
[card-body: p-[18px]]
  [● dot + CATEGORY NAME]
  [Title]
  [Excerpt — 2 lines, v-html]
  [─ divider ─]
  [Author name (left)]    [Date (right)]
```

### Classes
- Card wrapper: `group flex flex-col rounded-xl border border-gray-100 dark:border-[#222] bg-white dark:bg-[#161616] overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-200`
- Image wrapper: `relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-[#1f1f1f] flex-shrink-0`
- Image: `w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500`
- Reading time badge: `absolute top-2.5 right-2.5 bg-black/50 text-white text-[9px] font-bold px-2 py-0.5 rounded-full`
- Body: `flex flex-col flex-1 p-[18px] gap-2`
- Category row: `flex items-center gap-1.5`
  - Dot: `w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0`
  - Label: `text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest`
- Title: `text-[15px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 tracking-[-0.2px] group-hover:text-primary transition-colors`
- Excerpt: `text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1`
- Footer: `flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#222] text-[11px] text-gray-400 dark:text-gray-500 mt-auto`

---

## 5. AppFooter Redesign

**File:** `app/components/ui/AppFooter.vue`

### Structure
```
[Brand + tagline + socials]
─────────────────────────────────────────────
[AI Models]  [Claude]  [Gemini]  [Company]
─────────────────────────────────────────────
© 2025 theintelliprompt   Terms   Privacy
```

Newsletter form is **removed** from footer (it lives on the homepage).
Columns reduced from 6 to 4 — drop `AI World` and `Resources`.

### `COLUMNS` data
```ts
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
```

### Key classes
- Footer: `bg-[#0a0a0a] border-t border-[#1f1f1f]`
- Container: `max-w-[1200px] mx-auto px-8`
- Brand: `text-[20px] font-black text-white tracking-tight` + `<span class="text-primary">`
- Tagline: `text-[12px] text-[#555] mt-1.5`
- Top row: `flex justify-between items-start gap-10 pt-12 pb-10`
- Column grid: `grid grid-cols-2 sm:grid-cols-4 gap-8 py-9 border-b border-[#1a1a1a]`
- Column heading: `text-[10px] font-bold text-white uppercase tracking-[2px] mb-3.5`
- Column link: `block text-[12px] text-[#555] hover:text-white transition mb-2.5`
- Bottom bar: `text-center text-[11px] text-[#3a3a3a] py-6`

---

## 6. Files Changed (Summary)

| File | Change |
|------|--------|
| `nuxt.config.ts` | Replace font link array: remove Lora, add preconnects + Sora |
| `tailwind.config.js` | Delete `fontFamily.serif` (Lora); add `fontFamily.sans` (Sora) |
| `app/components/ui/AppHeader.vue` | Full template rewrite; add `mastheadSentinel`, `mastheadVisible`, IntersectionObserver; split `NAV_LINKS` / `DRAWER_LINKS` |
| `app/pages/index.vue` | Full template rewrite; remove carousel/news computed; add `listPosts`, `latestPosts` |
| `app/components/blog/BlogCard.vue` | Full template rewrite |
| `app/components/ui/AppFooter.vue` | Full template rewrite; 4-col `COLUMNS`; remove newsletter form |

**Not changed:** `BlogDetail.vue`, `BlogList.vue`, `BlogHorizontalCard.vue`, `BlogFeaturedSnippet.vue`, all services / composables / models / interfaces, `category/[slug].vue`, `about.vue`, `blog/[slug].vue`.

---

## 7. Constraints & Non-Goals

- No changes to `app/services/`, `app/composables/`, `app/models/`, `app/interfaces/`
- No new pages or routes
- No backend / API changes
- Dark mode variants required on all new UI — existing `useTheme()` composable must keep working
- `npm` only for any package installs
- Do not add `@nuxtjs/google-fonts` — load Sora via `nuxt.config.ts` `app.head.link[]` as specified
- Post fetch size `getPosts(1, 20)` is sufficient for all sections — do not change it
