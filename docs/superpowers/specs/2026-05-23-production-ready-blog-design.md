# NeuralBriefly – Production-Ready Blog Design

**Date:** 2026-05-23
**Status:** Approved
**Deployment:** Vercel (already configured)
**Stack:** Nuxt 4 + Tailwind CSS + WordPress REST API (headless)

---

## Overview

NeuralBriefly is an AI-focused headless blog. The WordPress backend at `neuralbriefly.com` (Hostinger) serves all content via REST API. The Nuxt 4 frontend is deployed on Vercel with ISR.

This spec covers everything needed to ship a production-quality blog: three feature waves, a shared data-layer foundation, and the exact files that change or are created in each wave.

---

## Current State (baseline)

### What works
- WordPress REST API integration: `getPosts`, `getPostBySlug`, `getCategories`, `getPostsByCategory`
- SEO: `useSeo` composable, `SeoHead` component, Open Graph + Twitter cards + JSON-LD Article schema
- Sitemap via `@nuxtjs/sitemap` + `server/api/sitemap-urls.ts`
- ISR on `/`, `/blog/**`, `/category/**`
- Dark/light theme toggle
- Responsive sticky header with mobile drawer
- Home hero grid, MoreStories (list/grid toggle), NewsletterSlider, category pages, about page
- Mock service for local development

### What is missing
- Search (icon in header, wired to nothing)
- Breadcrumb UI (JSON-LD BreadcrumbList exists on category pages only; no visible component anywhere)
- Post comments
- Pagination / load-more on all listing pages
- `/blog` index page (MoreStories links to it; page does not exist)
- Tag pages (`/tag/[slug]`)
- Related posts on post detail
- Social share buttons on posts
- Reading progress bar
- Author pages (`/author/[slug]`)
- RSS feed
- `robots.txt`
- `dateModified` missing from Article JSON-LD
- Tags in BlogDetail are plain `<span>` — not linked

---

## Data Layer (foundation — built before any wave)

All waves depend on these additions. Existing methods and interfaces are not changed.

### New interface: `app/interfaces/IPaginatedResult.ts`
```typescript
export interface IPaginatedResult<T> {
  items: T[]
  total: number
  totalPages: number
}
```

### New interface: `app/interfaces/IComment.ts`
```typescript
export interface IComment {
  id: number
  author: string
  avatarUrl: string | null
  content: string
  date: string
  parentId: number | null
}
```

### `ISeo` changes (`app/interfaces/ISeo.ts`)
- Replace `breadcrumb?: { name: string; url: string }` with `breadcrumbs?: Array<{ name: string; url: string }>`
- `ISeo.article.modifiedTime` already exists in the interface — no change needed there

### `PostModel` changes (`app/models/PostModel.ts`)
- Add `modifiedDate: string` field from `raw.modified`
- Add `authorSlug: string` field from `raw._embedded.author[0].slug`
- Set `seo.article.modifiedTime = this.modifiedDate`
- Build `seo.breadcrumbs` as a 3-level array: `[{ name: 'Home', url: '/' }, { name: category.name, url: '/category/category.slug' }, { name: this.title, url: '/blog/this.slug' }]` using the first category

### `IWordPressService` additions
```typescript
getPostsPaginated(page?: number, perPage?: number): Promise<IPaginatedResult<IPost>>
getPostsByCategoryPaginated(categoryId: number, page?: number): Promise<IPaginatedResult<IPost>>
getPostsByTag(tagId: number, page?: number): Promise<IPaginatedResult<IPost>>
searchPosts(query: string, page?: number): Promise<IPaginatedResult<IPost>>
getComments(postId: number): Promise<IComment[]>
postComment(postId: number, data: { author: string; email: string; content: string }): Promise<IComment>
getPostsByAuthor(authorId: number, page?: number): Promise<IPaginatedResult<IPost>>
getTags(): Promise<ITag[]>
getAuthorBySlug(slug: string): Promise<IAuthor | null>
```

### `WordPressService` implementation
- All paginated methods use `$fetch.raw()` to read `X-WP-Total` and `X-WP-TotalPages` response headers
- `getComments`: GET `/wp/v2/comments?post={id}&per_page=100&status=approve`
- `postComment`: POST `/wp/v2/comments` with `{ post, author_name, author_email, content }`
- `MockWordPressService` updated with stub implementations returning empty paginated results and empty comment arrays

### `useSeo` changes (`app/composables/useSeo.ts`)
- Handle `breadcrumbs[]` array: emit a second `<script type="application/ld+json">` BreadcrumbList block when `breadcrumbs` is present (3+ levels)
- Keep backward compatibility: if old single `breadcrumb` is passed (category pages not yet migrated), still works

---

## Wave 1 — Core Gaps

### 1. `app/components/ui/AppBreadcrumb.vue`
**Props:** `items: Array<{ label: string; to?: string }>`

Last item has no `to` (current page). Renders as:
```
Home  /  Machine Learning  /  Claude Constitutional AI Explained
```
- Separator: `/` in `text-gray-300 dark:text-gray-600`
- Links: `text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`
- Current page (last item): `text-gray-900 dark:text-white font-medium`, no link
- Placed in `app/pages/blog/[slug].vue` above `<BlogDetail>` and in `app/pages/category/[slug].vue` above the `<h1>`

### 2. `app/pages/blog/index.vue`
Full paginated post listing. This is what "See More AI Stories" links to.
- Uses `getPostsPaginated(page, 12)`
- `page` driven by `?page=N` query param (defaults to 1)
- Layout: same list/grid toggle as MoreStories (reuse identical markup)
- `<Pagination>` component at bottom
- SEO: title "All Posts – NeuralBriefly", no breadcrumb needed (top-level)
- ISR rule added in `nuxt.config.ts`: `'/blog': { isr: 120 }`

### 3. `app/components/ui/Pagination.vue`
**Props:** `currentPage: number`, `totalPages: number`

Renders: `← Prev  1  2  3 … 8  Next →`
- Navigates via `router.push({ query: { ...route.query, page: n } })` — no base path prop needed, query params are universal
- Shows max 5 page numbers with ellipsis for large counts
- Monochrome: active page `bg-gray-900 dark:bg-white text-white dark:text-gray-900`, others bordered

Used on: `/blog`, `/category/[slug]`, `/search`, `/tag/[slug]`, `/author/[slug]`

### 4. `app/pages/tag/[slug].vue`
Same structure as `app/pages/category/[slug].vue`.
- Finds tag from fetched tag list (add `getTags()` to service — GET `/wp/v2/tags?per_page=100&hide_empty=true`)
- Uses `getPostsByTag(tag.id, page)`
- SEO: title `[Tag] – NeuralBriefly`, breadcrumb `Home > #tag-name`
- Tags in `BlogDetail.vue` converted from `<span>` to `<NuxtLink :to="'/tag/' + tag.slug">`

### 5. Search

#### `app/composables/useSearch.ts`
```typescript
const query = ref('')
const results = ref<IPost[]>([])
const loading = ref(false)
const search = debounce(async (q: string) => { ... }, 300)
watch(query, search)
```

#### `app/components/ui/SearchModal.vue`
- **Trigger:** `useSearchModal()` composable with `isOpen` ref; header search icon calls `open()`
- **Layout:** fixed full-screen overlay (`bg-black/60 backdrop-blur-sm z-50`), centered panel `max-w-2xl`
- Input at top with search icon, autofocused on open
- Results list: thumbnail + title + category + date, each a `NuxtLink` that closes modal on click
- Empty state: "No results for 'query'"
- Loading state: 3 skeleton rows
- "View all results for 'query' →" link at bottom → `/search?q=query`
- ESC key and backdrop click close modal
- `<ClientOnly>` wrapper, teleported to body

#### `app/pages/search.vue`
- Reads `?q=` query param
- Calls `searchPosts(q, page)` on mount and on `q` / `page` change
- Heading: `X results for "query"`
- Full paginated list layout (same as `/blog`)
- Empty state: "No articles found for 'query'. Try different keywords."
- SEO: `title: 'Search: query – NeuralBriefly'`, `noindex: true` (search result pages should not be indexed)

#### `AppHeader.vue` changes
- Both desktop and mobile search icons call `useSearchModal().open()` instead of doing nothing
- `SearchModal` mounted once in `app/app.vue` at the app root level

---

## Wave 2 — Engagement Features

### 6. `app/components/blog/PostComments.vue`
Added to `BlogDetail.vue` between tags and the back link.

**Comment list section**
- Fetches via `getComments(post.id)` using `useAsyncData`
- Each comment: Gravatar avatar (40px circle), author name (bold), formatted date, content (rendered HTML, but sanitized — strip any `<script>` tags)
- Empty state: "No comments yet. Be the first to share your thoughts."
- Comments sorted oldest-first

**Comment form section**
Heading: "Leave a Comment"
Fields: Name (required), Email (required, `type="email"`, note "will not be published"), Comment (textarea, required)
Submit calls `postComment(post.id, data)`.
- Loading: button shows spinner, disabled
- Success: form hidden, shows "Your comment has been submitted and is awaiting moderation."
- Error: inline red message with WP API error text

> **WordPress setup required:** WP Admin → Settings → Discussion → enable "Allow people to post comments on new articles". The WP REST API respects this setting. No authentication is needed for guest comments.

### 7. `app/components/blog/RelatedPosts.vue`
Added to `BlogDetail.vue` between PostComments and the back link.

- Heading: `More in [primary category name]`
- Fetches `getPostsByCategory(post.categories[0].id, 1, 4)`, filters out current post slug, takes first 3
- Layout: horizontal cards — 80×60px thumbnail, title (2-line clamp), date
- Falls back silently (hides section) if fewer than 2 related posts found
- No loading state needed — data fetched server-side with `useAsyncData`

### 8. `app/components/blog/ShareButtons.vue`
Added to `BlogDetail.vue` above the tags section.

Label: `Share this article`
Three buttons:
- **X / Twitter:** `window.open('https://twitter.com/intent/tweet?url=URL&text=TITLE')`
- **LinkedIn:** `window.open('https://www.linkedin.com/shareArticle?mini=true&url=URL&title=TITLE')`
- **Copy link:** `navigator.clipboard.writeText(url)`, button text → "Copied!" for 2s via `setTimeout`

All icon-only with accessible `aria-label`. Monochrome icons, same style as existing UI. `<ClientOnly>` wrapper (uses `window`/`navigator`).

---

## Wave 3 — Polish & Discovery

### 9. `app/components/ui/ReadingProgress.vue`
- Fixed `top-0 left-0 z-50` 2px bar, `w-0` → `w-full` driven by scroll progress %
- `progress = scrollY / (body.scrollHeight - innerHeight) * 100`
- Color: `bg-gray-900 dark:bg-white`
- `<ClientOnly>` wrapper
- Added only inside `app/pages/blog/[slug].vue`, placed before `<AppHeader>` equivalent (it sits above everything)

### 10. `server/api/rss.xml.ts`
- Returns `Content-Type: application/rss+xml`
- Fetches latest 20 posts from WP API with `_embed`
- RSS 2.0 structure: `<channel>` with title, link, description, language, lastBuildDate; each post as `<item>` with title, link, description (excerpt stripped of HTML), pubDate, author, category
- Cached 10 minutes (same as sitemap route)
- `nuxt.config.ts` `app.head.link` gets: `{ rel: 'alternate', type: 'application/rss+xml', title: 'NeuralBriefly', href: '/api/rss.xml' }`

### 11. `app/pages/author/[slug].vue`
- Layout mirrors category page: author avatar + name + bio at top, then paginated post list
- Fetches author by matching slug from post embeds — add `getAuthorBySlug(slug)` to service (GET `/wp/v2/users?slug={slug}`)
- Uses `getPostsByAuthor(author.id, page)`
- Author name in `BlogDetail.vue` becomes `<NuxtLink :to="'/author/' + post.authorSlug">`
- SEO: `[Author Name] – NeuralBriefly`, breadcrumb `Home > Author Name`

### 12. SEO fixes

**`dateModified` in JSON-LD**
`PostModel` sets `seo.article.modifiedTime = this.modifiedDate`. `useSeo` already maps this to `dateModified` in the Article schema — it just was never populated.

**Full BreadcrumbList on post pages**
`PostModel` builds `seo.breadcrumbs` as a 3-item array. `useSeo` emits a second JSON-LD block:
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://neuralbriefly.com" },
    { "@type": "ListItem", "position": 2, "name": "Machine Learning", "item": "https://neuralbriefly.com/category/machine-learning" },
    { "@type": "ListItem", "position": 3, "name": "Claude Constitutional AI Explained", "item": "https://neuralbriefly.com/blog/claude-constitutional-ai-explained" }
  ]
}
```

**`public/robots.txt`**
```
User-agent: *
Allow: /

Sitemap: https://neuralbriefly.com/sitemap.xml
```

---

## File Inventory

### New files
| File | Wave |
|------|------|
| `app/interfaces/IPaginatedResult.ts` | Foundation |
| `app/interfaces/IComment.ts` | Foundation |
| `app/components/ui/AppBreadcrumb.vue` | 1 |
| `app/components/ui/Pagination.vue` | 1 |
| `app/components/ui/SearchModal.vue` | 1 |
| `app/composables/useSearch.ts` | 1 |
| `app/composables/useSearchModal.ts` | 1 |
| `app/pages/blog/index.vue` | 1 |
| `app/pages/tag/[slug].vue` | 1 |
| `app/pages/search.vue` | 1 |
| `app/components/blog/PostComments.vue` | 2 |
| `app/components/blog/RelatedPosts.vue` | 2 |
| `app/components/blog/ShareButtons.vue` | 2 |
| `app/components/ui/ReadingProgress.vue` | 3 |
| `server/api/rss.xml.ts` | 3 |
| `app/pages/author/[slug].vue` | 3 |
| `public/robots.txt` | 3 |

### Modified files
| File | Change |
|------|--------|
| `app/interfaces/ISeo.ts` | `breadcrumb` → `breadcrumbs[]` |
| `app/interfaces/IWordPressService.ts` | Add 7 new method signatures |
| `app/models/PostModel.ts` | Add `modifiedDate`, `authorSlug`, populate `seo.article.modifiedTime`, build `seo.breadcrumbs` |
| `app/services/WordPressService.ts` | Implement 7 new methods + `getTags()` + `getAuthorBySlug()` |
| `app/services/MockWordPressService.ts` | Stub implementations for all new methods |
| `app/composables/useSeo.ts` | Handle `breadcrumbs[]` array, emit second JSON-LD block |
| `app/components/blog/BlogDetail.vue` | Add ShareButtons, PostComments, RelatedPosts; tags → NuxtLinks |
| `app/components/ui/AppHeader.vue` | Wire search icons to `useSearchModal().open()` |
| `app/pages/blog/[slug].vue` | Add AppBreadcrumb, ReadingProgress |
| `app/pages/category/[slug].vue` | Add AppBreadcrumb, Pagination, migrate to `getPostsByCategoryPaginated` |
| `nuxt.config.ts` | Add `/blog` ISR rule, add RSS `<link>` to head |
| `app/app.vue` | Mount `SearchModal` once at app level |

---

## WordPress Configuration Required

Before Wave 2 comments work:
1. WP Admin → Settings → Discussion → check "Allow people to post comments on new articles"
2. Optional: uncheck "Comment author must fill out name and email" if you want minimal friction (not recommended)
3. Optional: uncheck "Before a comment appears: Comment must be manually approved" if you want instant publishing (not recommended — keep moderation on)

---

## Out of Scope

- Newsletter subscription (deferred — no email service chosen)
- Comment threading/nesting (flat comments only)
- Comment editing/deletion by users
- User authentication / accounts
- Post likes / reactions
- Analytics integration
