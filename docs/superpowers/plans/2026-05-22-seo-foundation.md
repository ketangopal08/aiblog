# SEO + Foundation Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full SEO meta tags, JSON-LD structured data, sitemap, ISR route rules, and error page; fix config inconsistencies and remove the unused `useWordPress.ts` composable.

**Architecture:** A new `useSeo.ts` composable centralises all `useSeoMeta()` + JSON-LD logic. `SeoHead.vue` becomes a thin wrapper that delegates to it. `ISeo` is expanded with `ogType`, `canonicalUrl`, `article`, and `breadcrumb` fields. `@nuxtjs/sitemap` feeds off a Nitro server route that fetches WP post slugs dynamically.

**Tech Stack:** Nuxt 4, @nuxtjs/sitemap, Tailwind CSS, WordPress REST API, TypeScript

---

## File Map

| Action | File |
|--------|------|
| Modify | `app/interfaces/ISeo.ts` |
| Create | `app/composables/useSeo.ts` |
| Modify | `app/components/seo/SeoHead.vue` |
| Modify | `app/models/PostModel.ts` |
| Modify | `app/pages/index.vue` |
| Modify | `app/pages/category/[slug].vue` |
| Modify | `app/pages/about.vue` |
| Modify | `app/plugins/wordpress.ts` |
| Modify | `nuxt.config.ts` |
| Modify | `public/robots.txt` |
| Modify | `.env` |
| Create | `app/error.vue` |
| Create | `server/api/sitemap-urls.ts` |
| Delete | `app/composables/useWordPress.ts` |

`blog/[slug].vue` needs **no changes**: it already renders `<SeoHead :seo="post.seo" />`, and updating `PostModel.seo` in Task 5 is sufficient.

---

### Task 1: Install @nuxtjs/sitemap

**Files:**
- Modify: `package.json`, `package-lock.json` (via npm)

- [ ] **Step 1: Install the module**

```bash
npm install @nuxtjs/sitemap
```

Expected: Resolves without errors. `@nuxtjs/sitemap` appears in `package.json` dependencies.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @nuxtjs/sitemap"
```

---

### Task 2: Expand ISeo interface

**Files:**
- Modify: `app/interfaces/ISeo.ts`

- [ ] **Step 1: Replace ISeo.ts**

Replace the entire contents of `app/interfaces/ISeo.ts` with:

```ts
export interface ISeo {
  title: string
  description: string
  ogImage?: string
  ogType?: 'article' | 'website'
  canonicalUrl?: string
  article?: {
    publishedTime: string
    modifiedTime?: string
    author: string
    tags?: string[]
  }
  breadcrumb?: {
    name: string
    url: string
  }
}
```

- [ ] **Step 2: Verify TypeScript sees no new errors**

```bash
npx nuxi prepare
```

Expected: Exits 0. TypeScript errors in `PostModel.ts` are expected here (the seo assignment still uses the old shape) — they will be fixed in Task 5.

- [ ] **Step 3: Commit**

```bash
git add app/interfaces/ISeo.ts
git commit -m "feat(seo): expand ISeo with ogType, canonicalUrl, article, breadcrumb"
```

---

### Task 3: Create useSeo composable

**Files:**
- Create: `app/composables/useSeo.ts`

- [ ] **Step 1: Create useSeo.ts**

Create `app/composables/useSeo.ts` with:

```ts
import type { ISeo } from '~/interfaces/ISeo'

export const useSeo = (seo: ISeo) => {
  const url = useRequestURL()
  const canonicalUrl = seo.canonicalUrl ?? url.href
  const ogType = seo.ogType ?? 'website'
  const ogImage = seo.ogImage

  useSeoMeta({
    title: seo.title,
    ogTitle: seo.title,
    twitterTitle: seo.title,
    description: seo.description,
    ogDescription: seo.description,
    twitterDescription: seo.description,
    ogType,
    ogUrl: canonicalUrl,
    ...(ogImage
      ? { ogImage, twitterImage: ogImage, twitterCard: 'summary_large_image' as const }
      : { twitterCard: 'summary' as const }
    ),
  })

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(buildJsonLd(seo, canonicalUrl)) }],
  })
}

function buildJsonLd(seo: ISeo, canonicalUrl: string): Record<string, unknown> {
  if (seo.article) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.title,
      description: seo.description,
      ...(seo.ogImage && { image: seo.ogImage }),
      datePublished: seo.article.publishedTime,
      ...(seo.article.modifiedTime && { dateModified: seo.article.modifiedTime }),
      author: { '@type': 'Person', name: seo.article.author },
      publisher: {
        '@type': 'Organization',
        name: 'NeuralBriefly',
        url: 'https://neuralbriefly.com',
      },
      url: canonicalUrl,
      ...(seo.article.tags?.length && { keywords: seo.article.tags.join(', ') }),
    }
  }

  if (seo.breadcrumb) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://neuralbriefly.com' },
        {
          '@type': 'ListItem',
          position: 2,
          name: seo.breadcrumb.name,
          item: `https://neuralbriefly.com${seo.breadcrumb.url}`,
        },
      ],
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NeuralBriefly',
    url: 'https://neuralbriefly.com',
    description: seo.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://neuralbriefly.com/?s={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
```

- [ ] **Step 2: Verify auto-import registration**

```bash
npx nuxi prepare
```

Expected: `useSeo` appears in `.nuxt/imports.d.ts`. Exit 0.

- [ ] **Step 3: Commit**

```bash
git add app/composables/useSeo.ts
git commit -m "feat(seo): add useSeo composable — useSeoMeta + JSON-LD (Article/BreadcrumbList/WebSite)"
```

---

### Task 4: Update SeoHead.vue to delegate to useSeo

**Files:**
- Modify: `app/components/seo/SeoHead.vue`

- [ ] **Step 1: Replace SeoHead.vue**

Replace the entire contents of `app/components/seo/SeoHead.vue` with:

```vue
<script setup lang="ts">
import type { ISeo } from '~/interfaces/ISeo'
const props = defineProps<{ seo: ISeo }>()
useSeo(props.seo)
</script>

<template><slot /></template>
```

- [ ] **Step 2: Start dev server and verify homepage head tags**

```bash
npm run dev
```

Navigate to `http://localhost:3000`. Open DevTools → Elements → `<head>`. Confirm all of these are present:
- `<title>` tag
- `<meta name="description">`
- `<meta property="og:title">`
- `<meta property="og:description">`
- `<link rel="canonical">`
- `<script type="application/ld+json">`

No console errors expected.

- [ ] **Step 3: Commit**

```bash
git add app/components/seo/SeoHead.vue
git commit -m "refactor(seo): SeoHead.vue delegates all logic to useSeo composable"
```

---

### Task 5: Update PostModel to emit full ISeo

**Files:**
- Modify: `app/models/PostModel.ts`

- [ ] **Step 1: Update the seo assignment in PostModel constructor**

In `app/models/PostModel.ts`, find and replace this block:

```ts
    this.seo = {
      title: this.title,
      description: this.excerpt.replace(/<[^>]+>/g, '').trim(),
      ogImage: this.featuredImage ?? `https://picsum.photos/seed/${this.id}/1200/630`
    }
```

Replace with:

```ts
    this.seo = {
      title: this.title,
      description: this.excerpt.replace(/<[^>]+>/g, '').trim(),
      ogImage: this.featuredImage ?? undefined,
      ogType: 'article',
      article: {
        publishedTime: this.date,
        author: this.author.name,
        tags: this.tags.map(t => t.name),
      },
    }
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx nuxi prepare
```

Expected: Exit 0. No TypeScript errors.

- [ ] **Step 3: Verify blog post SEO in browser**

With `npm run dev` running, navigate to `/blog/gpt-4o-everything-you-need-to-know` (or any slug from the mock data). In DevTools → `<head>`, confirm:

- `<meta property="og:type" content="article">`
- `<link rel="canonical">` is present
- `<script type="application/ld+json">` contains `"@type": "Article"` with `datePublished`, `author.name`, and `keywords`

- [ ] **Step 4: Commit**

```bash
git add app/models/PostModel.ts
git commit -m "feat(seo): PostModel emits full ISeo — ogType article, author, tags, publishedTime"
```

---

### Task 6: Update nuxt.config.ts

**Files:**
- Modify: `nuxt.config.ts`

- [ ] **Step 1: Replace nuxt.config.ts**

Replace the entire contents of `nuxt.config.ts` with:

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap',
        },
        { rel: 'preconnect', href: 'https://neuralbriefly.com' },
      ],
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],
  css: ['~/assets/css/main.css'],
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  runtimeConfig: {
    public: {
      wpBaseUrl: process.env.WP_BASE_URL ?? 'https://neuralbriefly.com',
    },
  },
  routeRules: {
    '/': { isr: 60 },
    '/blog/**': { isr: 300 },
    '/category/**': { isr: 120 },
  },
  sitemap: {
    sources: ['/api/sitemap-urls'],
  },
})
```

- [ ] **Step 2: Restart dev server and verify it still starts**

Stop any running dev server (`Ctrl+C`), then:

```bash
npm run dev
```

Expected: Dev server starts on port 3000 without errors. Homepage loads correctly.

- [ ] **Step 3: Commit**

```bash
git add nuxt.config.ts
git commit -m "feat(config): add sitemap module, ISR routeRules, preconnect; remove duplicate wpUrl"
```

---

### Task 7: Fix wordpress.ts plugin and delete useWordPress.ts

**Files:**
- Modify: `app/plugins/wordpress.ts`
- Delete: `app/composables/useWordPress.ts`

- [ ] **Step 1: Update app/plugins/wordpress.ts**

Replace the entire contents of `app/plugins/wordpress.ts` with:

```ts
import { WordPressService } from '~/services/WordPressService'
import { MockWordPressService } from '~/services/MockWordPressService'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const useMock = config.public.wpBaseUrl === 'https://your-wordpress-site.com' || !config.public.wpBaseUrl
  const wpService = useMock
    ? new MockWordPressService()
    : new WordPressService(config.public.wpBaseUrl)

  return {
    provide: {
      wp: wpService,
    },
  }
})
```

- [ ] **Step 2: Delete useWordPress.ts**

```bash
rm app/composables/useWordPress.ts
```

- [ ] **Step 3: Confirm no imports remain**

```bash
grep -r "useWordPress" app/ --include="*.ts" --include="*.vue"
```

Expected: No output (no remaining references).

- [ ] **Step 4: Verify TypeScript**

```bash
npx nuxi prepare
```

Expected: Exit 0. No errors about missing `useWordPress`.

- [ ] **Step 5: Commit**

```bash
git add app/plugins/wordpress.ts
git rm app/composables/useWordPress.ts
git commit -m "refactor: remove duplicate useWordPress composable; \$wp plugin is canonical WP access"
```

---

### Task 8: Create sitemap server route

**Files:**
- Create: `server/api/sitemap-urls.ts`

- [ ] **Step 1: Create the server directory**

```bash
mkdir -p server/api
```

- [ ] **Step 2: Create server/api/sitemap-urls.ts**

```ts
interface WPPostSlug {
  slug: string
}

export default defineCachedEventHandler(async () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.wpBaseUrl

  try {
    const posts = await $fetch<WPPostSlug[]>(`${baseUrl}/wp-json/wp/v2/posts`, {
      params: { per_page: 100, _fields: 'slug' },
    })

    return posts.map(post => ({
      loc: `/blog/${post.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
    }))
  } catch {
    return []
  }
}, {
  maxAge: 60 * 10,
  name: 'sitemap-wp-urls',
})
```

- [ ] **Step 3: Test the route in dev**

With `npm run dev` running:

```bash
curl -s http://localhost:3000/api/sitemap-urls | head -c 200
```

Expected: A JSON array. If WP is reachable it contains `{ loc, changefreq, priority }` objects. If not, an empty array `[]`. Either is correct.

Then check the sitemap itself:

```bash
curl -s http://localhost:3000/sitemap.xml | head -c 500
```

Expected: Valid XML starting with `<?xml` containing `<loc>` entries including `/` and `/about`.

- [ ] **Step 4: Commit**

```bash
git add server/api/sitemap-urls.ts
git commit -m "feat(sitemap): Nitro server route feeds WP post slugs to @nuxtjs/sitemap"
```

---

### Task 9: Update index.vue — homepage SEO

**Files:**
- Modify: `app/pages/index.vue`

- [ ] **Step 1: Add homeSeo constant to script setup**

In `app/pages/index.vue`, in the `<script setup>` block, add this constant after the existing `try/catch` block and before `</script>`:

```ts
const homeSeo = {
  title: 'NeuralBriefly – AI News & Analysis',
  description: 'Latest articles on GPT, Gemini, Claude and the AI world.',
  ogType: 'website' as const,
}
```

- [ ] **Step 2: Update the SeoHead call in the template**

Find:
```html
<SeoHead :seo="{ title: 'AI Blog – Home', description: 'Latest articles on GPT, Gemini, Claude and the AI world.' }" />
```

Replace with:
```html
<SeoHead :seo="homeSeo" />
```

- [ ] **Step 3: Verify in browser**

Navigate to `http://localhost:3000`. In DevTools → `<head>`:

- `<title>NeuralBriefly – AI News & Analysis</title>`
- `<meta property="og:type" content="website">` (previously was `article` — this is the bug fix)
- `<script type="application/ld+json">` contains `"@type": "WebSite"` with `potentialAction`

- [ ] **Step 4: Commit**

```bash
git add app/pages/index.vue
git commit -m "feat(seo): homepage — ogType website, WebSite JSON-LD schema"
```

---

### Task 10: Update category/[slug].vue — BreadcrumbList SEO

**Files:**
- Modify: `app/pages/category/[slug].vue`

- [ ] **Step 1: Replace category/[slug].vue**

Replace the entire contents of `app/pages/category/[slug].vue` with:

```vue
<script setup lang="ts">
const route = useRoute()
const { $wp } = useNuxtApp()
const { categories, fetchCategories } = useCategories()

await fetchCategories()

const category = computed(() =>
  categories.value.find(c => c.slug === route.params.slug)
)

const posts = ref([])
if (category.value) {
  posts.value = await $wp.getPostsByCategory(category.value.id) as any[]
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <template v-if="category">
      <SeoHead :seo="{
        title: `${category.name} – NeuralBriefly`,
        description: `Browse all ${category.name} articles on NeuralBriefly.`,
        ogType: 'website',
        breadcrumb: { name: category.name, url: `/category/${category.slug}` },
      }" />
      <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest border-b-2 border-gray-900 dark:border-white pb-3 inline-block">
        {{ category.name }}
      </h1>
      <BlogList :posts="posts" />
    </template>
    <p v-else class="text-gray-500 dark:text-gray-400">Category not found.</p>
  </div>
</template>
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/category/gpt`. In DevTools → `<head>`:

- `<title>GPT – NeuralBriefly</title>`
- `<script type="application/ld+json">` contains `"@type": "BreadcrumbList"` with 2 items: Home and GPT

- [ ] **Step 3: Commit**

```bash
git add "app/pages/category/[slug].vue"
git commit -m "feat(seo): category pages — BreadcrumbList JSON-LD, correct ogType"
```

---

### Task 11: Update about.vue — full SEO

**Files:**
- Modify: `app/pages/about.vue`

- [ ] **Step 1: Replace about.vue**

Replace the entire contents of `app/pages/about.vue` with:

```vue
<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <SeoHead :seo="{
      title: 'About – NeuralBriefly',
      description: 'NeuralBriefly covers GPT, Gemini, Claude and the broader AI landscape.',
      ogType: 'website',
    }" />
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">About</h1>
    <p class="text-gray-600 dark:text-gray-400">
      This is an AI-focused blog powered by Nuxt and WordPress as a headless CMS.
    </p>
  </div>
</template>
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/about`. In DevTools → `<head>`:

- `<title>About – NeuralBriefly</title>`
- `<meta property="og:type" content="website">`

- [ ] **Step 3: Commit**

```bash
git add app/pages/about.vue
git commit -m "feat(seo): about page — useSeo via SeoHead, ogType website"
```

---

### Task 12: Create error.vue

**Files:**
- Create: `app/error.vue`

- [ ] **Step 1: Create app/error.vue**

```vue
<script setup lang="ts">
const error = useError()
const is404 = computed(() => error.value?.statusCode === 404)

const handleBack = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-[#0D0D0D] transition-colors duration-300">
    <AppHeader />
    <main class="flex-1 flex items-center justify-center px-6">
      <div class="text-center max-w-md">
        <p class="text-[80px] font-black text-gray-900 dark:text-white leading-none mb-4 tracking-tighter">
          {{ error?.statusCode ?? 500 }}
        </p>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {{ is404 ? 'Page not found' : 'Something went wrong' }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {{ is404
            ? "The page you're looking for doesn't exist or has been moved."
            : 'An unexpected error occurred. Please try again.' }}
        </p>
        <button
          type="button"
          class="text-sm font-bold text-gray-900 dark:text-white
                 border border-gray-900 dark:border-white px-6 py-3
                 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition"
          @click="handleBack"
        >
          ← Back to homepage
        </button>
      </div>
    </main>
  </div>
</template>
```

- [ ] **Step 2: Test the 404 page**

With `npm run dev` running, navigate to `http://localhost:3000/this-route-does-not-exist`.

Expected: The error page renders with status code `404`, heading "Page not found", and a "← Back to homepage" button that navigates to `/`.

- [ ] **Step 3: Commit**

```bash
git add app/error.vue
git commit -m "feat: add error.vue — monochrome 404/500 error boundary page"
```

---

### Task 13: Update robots.txt and .env

**Files:**
- Modify: `public/robots.txt`
- Modify: `.env` (not committed)

- [ ] **Step 1: Update public/robots.txt**

Replace the entire contents of `public/robots.txt` with:

```
User-Agent: *
Disallow:

Sitemap: https://neuralbriefly.com/sitemap.xml
```

- [ ] **Step 2: Update .env**

In `.env`, remove the `NUXT_PUBLIC_WP_URL` line. The file should contain only:

```
WP_BASE_URL=https://neuralbriefly.com
```

- [ ] **Step 3: Verify config still loads**

Restart the dev server:

```bash
npm run dev
```

Expected: Starts without errors. The `$wp` plugin initialises correctly (homepage loads posts or mock data as before).

- [ ] **Step 4: Commit (robots.txt only — never commit .env)**

```bash
git add public/robots.txt
git commit -m "feat(seo): robots.txt — add Sitemap reference"
```

---

### Task 14: Final end-to-end verification

- [ ] **Step 1: Confirm all routes serve correctly**

With `npm run dev` running, visit each of these and confirm no console errors:

| URL | Expected |
|-----|----------|
| `http://localhost:3000/` | Homepage loads |
| `http://localhost:3000/blog/gpt-4o-everything-you-need-to-know` | Post loads |
| `http://localhost:3000/category/gpt` | Category loads |
| `http://localhost:3000/about` | About loads |
| `http://localhost:3000/nonexistent` | Custom 404 page |
| `http://localhost:3000/sitemap.xml` | XML sitemap returned |
| `http://localhost:3000/robots.txt` | Contains `Sitemap:` line |

- [ ] **Step 2: Audit head tags on each page type**

**Homepage** (`/`):
- `og:type = website` ✓
- JSON-LD `@type = WebSite` with `potentialAction` ✓
- `canonical` present ✓

**Blog post** (`/blog/...`):
- `og:type = article` ✓
- JSON-LD `@type = Article` with `datePublished`, `author`, `keywords` ✓
- `canonical` present ✓

**Category** (`/category/...`):
- JSON-LD `@type = BreadcrumbList` with 2 items ✓

**About** (`/about`):
- `og:type = website` ✓
- `title = About – NeuralBriefly` ✓

- [ ] **Step 3: Final commit if any loose changes remain**

```bash
git status
# If anything unstaged:
git add -A
git commit -m "chore: final SEO + foundation audit cleanup"
```
