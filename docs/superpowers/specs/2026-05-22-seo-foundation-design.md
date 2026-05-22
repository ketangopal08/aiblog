# SEO + Foundation Fixes — Design Spec
**Date:** 2026-05-22  
**Project:** NeuralBriefly (aiblog)  
**Status:** Approved

---

## Problem

The blog has a working UI but several high-impact SEO and foundation gaps:

- `og:type` is hardcoded `'article'` on every page including the homepage (should be `'website'`)
- No canonical URL tag on any page
- No JSON-LD structured data (Article, WebSite, BreadcrumbList)
- `ISeo` interface carries only 3 fields — insufficient for full OG/Twitter coverage
- `SeoHead.vue` uses `useHead()` instead of `useSeoMeta()`
- Redundant `useWordPress.ts` composable exists alongside `$wp` plugin but is unused and inconsistent
- `nuxt.config.ts` declares two WP URL keys (`wpBaseUrl`, `wpUrl`) — only one is needed
- No sitemap (`/sitemap.xml`)
- `robots.txt` has no Sitemap reference
- No `error.vue` — Nuxt's default error page shows on 404/500

---

## Scope

**In:** SEO composable, JSON-LD schemas, sitemap module, ISR routeRules, error page, config cleanup  
**Out:** `@nuxt/image` (next batch), pagination (next batch), tag pages (next batch)

---

## Architecture

```
app/
  interfaces/
    ISeo.ts              ← expanded interface
  composables/
    useSeo.ts            ← NEW: all SEO logic
    useWordPress.ts      ← DELETED (unused, conflicts with $wp)
  components/
    seo/SeoHead.vue      ← thin wrapper calling useSeo()
  pages/
    index.vue            ← update seo prop to include new fields
    blog/[slug].vue      ← update seo prop
    category/[slug].vue  ← update seo prop
    about.vue            ← update seo prop
    error.vue            ← NEW: Nuxt error boundary
  plugins/
    wordpress.ts         ← remove wpUrl reference
nuxt.config.ts           ← add sitemap module, fix runtimeConfig, add routeRules
public/
  robots.txt             ← add Sitemap: line
```

---

## ISeo Interface (expanded)

```ts
export interface ISeo {
  title: string
  description: string
  ogImage?: string                // falls back to a default OG image
  ogType?: 'article' | 'website' // defaults to 'website' if not set
  canonicalUrl?: string           // falls back to useRequestURL().href
  article?: {
    publishedTime: string         // ISO 8601 date string
    modifiedTime?: string
    author: string
    tags?: string[]
  }
}
```

---

## `useSeo()` Composable

**File:** `app/composables/useSeo.ts`

**Inputs:** `ISeo` object  
**Actions:**

1. Resolves `canonicalUrl` — uses provided override or `useRequestURL().href`
2. Calls `useSeoMeta()` with:
   - `title`, `ogTitle`, `twitterTitle`
   - `description`, `ogDescription`, `twitterDescription`
   - `ogImage`, `twitterImage`
   - `ogType` (from prop, default `'website'`)
   - `ogUrl` (= resolved canonical)
   - `twitterCard: 'summary_large_image'` if image present, else `'summary'`
3. Calls `useHead()` with:
   - `link: [{ rel: 'canonical', href: canonicalUrl }]`
   - `script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }]`

**JSON-LD schema selection:**

| Condition | Schema emitted |
|-----------|---------------|
| `ogType === 'website'` or no `article` | `WebSite` with `SearchAction` potentialAction |
| `article` present | `Article` (headline, image, datePublished, dateModified, author) |
| Category/tag pages (inferred from `ogType !== 'article'` + no `article`) | `BreadcrumbList` with two items: Home → Category |

The composable is a pure Nuxt composable (uses `useRequestURL`, `useSeoMeta`, `useHead`).

---

## `SeoHead.vue` (updated)

```vue
<script setup lang="ts">
import type { ISeo } from '~/interfaces/ISeo'
const props = defineProps<{ seo: ISeo }>()
useSeo(props.seo)
</script>
<template><slot /></template>
```

No logic in the component. All pages continue to use `<SeoHead :seo="...">` with no template changes.

---

## Page-level SEO prop updates

### `index.vue`

```ts
const seo: ISeo = {
  title: 'NeuralBriefly – AI News & Analysis',
  description: 'Latest articles on GPT, Gemini, Claude and the AI world.',
  ogType: 'website',
  ogImage: '/og-default.jpg',  // static default OG image
}
```

### `blog/[slug].vue`

```ts
// populated from post.seo after fetch
const seo: ISeo = {
  title: post.seo.title,
  description: post.seo.description,
  ogImage: post.seo.ogImage,
  ogType: 'article',
  article: {
    publishedTime: post.date,
    author: post.author.name,
    tags: post.tags.map(t => t.name),
  }
}
```

The `ISeo` on `PostModel` is also updated to compute and expose `article` metadata.

### `category/[slug].vue`

```ts
const seo: ISeo = {
  title: `${category.name} – NeuralBriefly`,
  description: `Browse all ${category.name} articles on NeuralBriefly.`,
  ogType: 'website',
}
```

### `about.vue`

```ts
const seo: ISeo = {
  title: 'About – NeuralBriefly',
  description: 'NeuralBriefly covers GPT, Gemini, Claude and the broader AI landscape.',
  ogType: 'website',
}
```

---

## Foundation Fixes

### `nuxt.config.ts` changes

1. **`runtimeConfig`**: Remove `wpUrl`. Single key: `wpBaseUrl`.
2. **`modules`**: Add `'@nuxtjs/sitemap'`.
3. **`sitemap`**: Configure with dynamic WordPress routes fetched from WP API.
4. **`routeRules`**: Add ISR caching:
   ```ts
   routeRules: {
     '/': { isr: 60 },
     '/blog/**': { isr: 300 },
     '/category/**': { isr: 120 },
   }
   ```
5. **`app.head`**: Add `preconnect` for WP API domain (`neuralbriefly.com`).

### `plugins/wordpress.ts`

Remove reference to `config.public.wpUrl`. Only `config.public.wpBaseUrl` used.

### `useWordPress.ts`

Delete. The file exists but no page or component imports it. The `$wp` plugin is the canonical API access pattern.

### `public/robots.txt`

```
User-Agent: *
Disallow:

Sitemap: https://neuralbriefly.com/sitemap.xml
```

---

## `error.vue` (Nuxt error boundary)

**File:** `app/error.vue`  
**Design:** Matches site monochrome theme. Shows:
- `404` → "Page not found" with back link to homepage
- `5xx` → "Something went wrong" with retry button

Uses `useError()` and `clearError()`. No external dependencies.

---

## Sitemap Configuration

Install: `npm install @nuxtjs/sitemap`

```ts
// nuxt.config.ts
sitemap: {
  sitemapName: 'sitemap.xml',
  sources: [
    '/api/__sitemap__/urls'   // custom server route that fetches WP slugs
  ],
  defaults: {
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
}
```

A server API route `server/api/__sitemap__/urls.ts` fetches all post slugs from WP and returns them in the format `@nuxtjs/sitemap` expects. Static routes (`/`, `/about`) are auto-discovered.

---

## Self-Review

- No TBDs or placeholders remain
- `og:type` bug is explicitly addressed in both `ISeo` and `useSeo()`
- `SeoHead.vue` template API unchanged — pages only need seo prop updates, not template changes
- `useWordPress.ts` deletion is safe — confirmed no imports in any file
- Sitemap source route pulls real WP data, not hardcoded
- `routeRules` ISR values match the user's stated requirements (60s home, 300s posts, 120s categories)
- BreadcrumbList is in scope for category pages
