# Production Blog – Wave 2 & 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add engagement features (comments, related posts, social share), then polish and discovery features (reading progress, RSS feed, author pages, SEO fixes).

**Architecture:** All Wave 2 components are added to `BlogDetail.vue` in a fixed order: ShareButtons (above tags) → PostComments (below tags) → RelatedPosts (below comments). Wave 3 features are independently added: ReadingProgress in the post page, RSS as a server route, author pages as a new route group.

**Prerequisites:** Wave 1 plan must be fully complete. All Wave 1 types and service methods are available.

**Tech Stack:** Nuxt 4, TypeScript, Tailwind CSS, WordPress REST API, Vitest

**Spec:** `docs/superpowers/specs/2026-05-23-production-ready-blog-design.md`

---

## Task 1: ShareButtons Component

**Files:**
- Create: `app/components/blog/ShareButtons.vue`

- [ ] **Step 1: Create `app/components/blog/ShareButtons.vue`**

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>()

const copied = ref(false)

function shareTwitter() {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(props.title)
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener')
}

function shareLinkedIn() {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(props.title)
  window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`, '_blank', 'noopener')
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // clipboard API unavailable (e.g. non-HTTPS dev) — silently ignore
  }
}
</script>

<template>
  <ClientOnly>
    <div class="mt-8 flex items-center gap-3">
      <span class="text-[10px] font-black uppercase tracking-[2.5px] text-gray-500 dark:text-gray-400">
        Share
      </span>

      <!-- X / Twitter -->
      <button
        type="button"
        @click="shareTwitter"
        aria-label="Share on X (Twitter)"
        class="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-white/10
               text-gray-500 dark:text-gray-400
               hover:border-gray-900 dark:hover:border-white
               hover:text-gray-900 dark:hover:text-white
               transition-colors"
      >
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </button>

      <!-- LinkedIn -->
      <button
        type="button"
        @click="shareLinkedIn"
        aria-label="Share on LinkedIn"
        class="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-white/10
               text-gray-500 dark:text-gray-400
               hover:border-gray-900 dark:hover:border-white
               hover:text-gray-900 dark:hover:text-white
               transition-colors"
      >
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>

      <!-- Copy link -->
      <button
        type="button"
        @click="copyLink"
        :aria-label="copied ? 'Link copied' : 'Copy link'"
        class="flex items-center gap-1.5 h-8 px-3 border border-gray-200 dark:border-white/10 text-[11px] font-semibold
               text-gray-500 dark:text-gray-400
               hover:border-gray-900 dark:hover:border-white
               hover:text-gray-900 dark:hover:text-white
               transition-colors"
      >
        <svg v-if="!copied" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        {{ copied ? 'Copied!' : 'Copy link' }}
      </button>
    </div>
  </ClientOnly>
</template>
```

- [ ] **Step 2: Add ShareButtons to `app/components/blog/BlogDetail.vue`**

In `BlogDetail.vue`, add `<ShareButtons :title="post.title" />` directly above the tags section:

```vue
    <!-- Share -->
    <ShareButtons :title="post.title" />

    <!-- Tags -->
    <div v-if="post.tags.length" ...>
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Navigate to any blog post. Three share buttons should appear above the tags. Clicking X opens a tweet compose window. Copy link button shows "Copied!" for 2 seconds.

- [ ] **Step 4: Commit**

```bash
git add app/components/blog/ShareButtons.vue app/components/blog/BlogDetail.vue
git commit -m "feat: add ShareButtons component to blog posts"
```

---

## Task 2: RelatedPosts Component

**Files:**
- Create: `app/components/blog/RelatedPosts.vue`

- [ ] **Step 1: Create `app/components/blog/RelatedPosts.vue`**

```vue
<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const props = defineProps<{ post: PostModel }>()

const { $wp } = useNuxtApp()

const { data: related } = await useAsyncData(
  `related-${props.post.id}`,
  async () => {
    if (!props.post.categories[0]) return []
    const res = await $wp.getPostsByCategory(props.post.categories[0].id, 1)
    return (res as PostModel[]).filter(p => p.slug !== props.post.slug).slice(0, 3)
  }
)

function postImg(post: PostModel) {
  return post.featuredImage || `https://picsum.photos/seed/${post.id}/160/120`
}
</script>

<template>
  <div v-if="related && related.length >= 2" class="mt-10 pt-6 border-t border-gray-200 dark:border-[#222]">
    <h3 class="text-[11px] font-black uppercase tracking-[3px] text-gray-900 dark:text-white mb-4">
      More in {{ post.categories[0]?.name ?? 'AI' }}
    </h3>
    <div class="flex flex-col gap-0">
      <NuxtLink
        v-for="item in related"
        :key="item.id"
        :to="`/blog/${item.slug}`"
        class="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-white/[0.06] group
               hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-2 px-2 transition-colors"
      >
        <div class="w-[80px] h-[60px] flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
          <img
            :src="postImg(item)"
            :alt="item.title"
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2
                     group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            {{ item.title }}
          </p>
          <span class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 block">
            {{ item.formattedDate }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Add RelatedPosts to `app/components/blog/BlogDetail.vue`**

Add after the back link section, at the end of the article:

```vue
    <!-- Back link -->
    <div class="mt-10">
      <NuxtLink to="/" ...>← Back to all posts</NuxtLink>
    </div>

    <!-- Related posts -->
    <RelatedPosts :post="post" />
  </article>
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open a blog post. Below the back link, related posts in the same category should appear (hidden when fewer than 2 related posts exist).

- [ ] **Step 4: Commit**

```bash
git add app/components/blog/RelatedPosts.vue app/components/blog/BlogDetail.vue
git commit -m "feat: add RelatedPosts component to blog posts"
```

---

## Task 3: PostComments Component

**Files:**
- Create: `app/components/blog/PostComments.vue`

> **Before this works in production:** Go to your WordPress admin → Settings → Discussion → check "Allow people to post comments on new articles". No other configuration needed for unauthenticated guest comments via the REST API.

- [ ] **Step 1: Create `app/components/blog/PostComments.vue`**

```vue
<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'
import type { IComment } from '~/interfaces/IComment'

const props = defineProps<{ post: PostModel }>()
const { $wp } = useNuxtApp()

const { data: comments, refresh } = await useAsyncData(
  `comments-${props.post.id}`,
  () => $wp.getComments(props.post.id)
)

const form = reactive({ author: '', email: '', content: '' })
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

function formattedCommentDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function sanitize(html: string): string {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

async function submit() {
  submitError.value = ''
  submitting.value = true
  try {
    await $wp.postComment(props.post.id, form)
    submitted.value = true
    form.author = ''
    form.email = ''
    form.content = ''
    refresh()
  } catch (err: any) {
    submitError.value = err?.data?.message ?? 'Failed to submit comment. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mt-10 pt-6 border-t border-gray-200 dark:border-[#222]">

    <!-- Comments list -->
    <h3 class="text-[11px] font-black uppercase tracking-[3px] text-gray-900 dark:text-white mb-6">
      {{ comments?.length ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Comments' }}
    </h3>

    <div v-if="comments?.length" class="flex flex-col gap-0 mb-10">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex gap-4 py-5 border-b border-gray-100 dark:border-white/[0.06]"
      >
        <img
          v-if="comment.avatarUrl"
          :src="comment.avatarUrl"
          :alt="comment.author"
          class="w-9 h-9 rounded-full flex-shrink-0 bg-gray-200 dark:bg-[#1a1a1a]"
        />
        <div v-else class="w-9 h-9 rounded-full flex-shrink-0 bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-[13px] font-bold text-gray-500 dark:text-gray-400">
          {{ comment.author[0]?.toUpperCase() ?? '?' }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-baseline gap-2 mb-1.5">
            <span class="text-[13px] font-bold text-gray-900 dark:text-white">{{ comment.author }}</span>
            <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ formattedCommentDate(comment.date) }}</span>
          </div>
          <div
            class="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed prose-sm"
            v-html="sanitize(comment.content)"
          />
        </div>
      </div>
    </div>

    <div v-else class="mb-10 text-sm text-gray-500 dark:text-gray-400 py-6 text-center border border-dashed border-gray-200 dark:border-white/[0.08]">
      No comments yet. Be the first to share your thoughts.
    </div>

    <!-- Comment form -->
    <div>
      <h4 class="text-[11px] font-black uppercase tracking-[3px] text-gray-900 dark:text-white mb-5">
        Leave a Comment
      </h4>

      <!-- Success state -->
      <div v-if="submitted" class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/[0.08] px-4 py-4">
        Your comment has been submitted and is awaiting moderation. Thank you!
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submit" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="comment-name" class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">Name <span class="text-red-500">*</span></label>
            <input
              id="comment-name"
              v-model="form.author"
              type="text"
              required
              autocomplete="name"
              class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label for="comment-email" class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">Email <span class="text-red-500">*</span> <span class="normal-case font-normal">(not published)</span></label>
            <input
              id="comment-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label for="comment-content" class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">Comment <span class="text-red-500">*</span></label>
          <textarea
            id="comment-content"
            v-model="form.content"
            required
            rows="5"
            class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-gray-900 dark:focus:border-white transition-colors resize-y"
            placeholder="Share your thoughts…"
          />
        </div>

        <div v-if="submitError" class="text-sm text-red-500 dark:text-red-400">
          {{ submitError }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="submitting"
            class="bg-gray-900 dark:bg-white text-white dark:text-gray-900
                   px-6 py-2.5 text-[11px] font-black uppercase tracking-[2px]
                   hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="submitting" class="flex items-center gap-2">
              <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Submitting…
            </span>
            <span v-else>Post Comment</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Add PostComments to `app/components/blog/BlogDetail.vue`**

Add `<PostComments :post="post" />` between the tags section and the back link:

```vue
    <!-- Tags -->
    <div v-if="post.tags.length" ...>...</div>

    <!-- Comments -->
    <PostComments :post="post" />

    <!-- Back link -->
    <div class="mt-10">
```

The final order in BlogDetail should be:
1. Hero image
2. Article body
3. ShareButtons
4. Tags
5. PostComments
6. Back link
7. RelatedPosts

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open any blog post. Comments section should appear (mock data shows 2 comments). Comment form should be visible below the list. Submitting in dev mode goes to MockWordPressService which returns a fake new comment immediately.

- [ ] **Step 4: Run all tests**

```bash
npm test
```

Expected: All 13 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/components/blog/PostComments.vue app/components/blog/BlogDetail.vue
git commit -m "feat: add PostComments component with list and submit form"
```

---

## Task 4: ReadingProgress Component

**Files:**
- Create: `app/components/ui/ReadingProgress.vue`
- Modify: `app/pages/blog/[slug].vue`

- [ ] **Step 1: Create `app/components/ui/ReadingProgress.vue`**

```vue
<script setup lang="ts">
const progress = ref(0)

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<template>
  <div
    class="fixed top-0 left-0 z-50 h-[2px] bg-gray-900 dark:bg-white transition-none pointer-events-none"
    :style="{ width: `${progress}%` }"
    role="progressbar"
    :aria-valuenow="Math.round(progress)"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Reading progress"
  />
</template>
```

- [ ] **Step 2: Add ReadingProgress to `app/pages/blog/[slug].vue`**

Wrap it in `<ClientOnly>` and place it at the top of the template, before the content container:

```vue
<template>
  <div>
    <ClientOnly>
      <ReadingProgress />
    </ClientOnly>
    <div class="max-w-4xl mx-auto px-4 py-10">
      <!-- rest of existing content -->
    </div>
  </div>
</template>
```

The outer `<div>` wrapper replaces the existing single `<div class="max-w-4xl...">` as the root element.

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open a long blog post. Scroll down — a 2px bar should fill from left to right across the top of the viewport.

- [ ] **Step 4: Commit**

```bash
git add app/components/ui/ReadingProgress.vue app/pages/blog/[slug].vue
git commit -m "feat: add reading progress bar to blog post pages"
```

---

## Task 5: RSS Feed

**Files:**
- Create: `server/api/rss.xml.ts`
- Modify: `nuxt.config.ts`

- [ ] **Step 1: Create `server/api/rss.xml.ts`**

```typescript
import type { WPPost } from '~~/app/types/wordpress'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

export default defineCachedEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')

  const config = useRuntimeConfig()
  const baseUrl = config.public.wpBaseUrl
  const siteUrl = 'https://neuralbriefly.com'

  let posts: WPPost[] = []
  try {
    posts = await $fetch<WPPost[]>(`${baseUrl}/wp-json/wp/v2/posts`, {
      params: { per_page: 20, _embed: true, orderby: 'date', order: 'desc' },
    })
  } catch {
    // WP API unreachable — return empty feed
  }

  const items = posts.map(post => {
    const title = escapeXml(post.title.rendered)
    const link = `${siteUrl}/blog/${post.slug}`
    const description = escapeXml(stripHtml(post.excerpt.rendered))
    const pubDate = new Date(post.date).toUTCString()
    const author = escapeXml(post._embedded?.author?.[0]?.name ?? 'NeuralBriefly')
    const category = escapeXml(post._embedded?.['wp:term']?.[0]?.[0]?.name ?? '')

    return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@neuralbriefly.com (${author})</author>
      ${category ? `<category>${category}</category>` : ''}
    </item>`
  }).join('')

  const lastBuildDate = posts[0] ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NeuralBriefly</title>
    <link>${siteUrl}</link>
    <description>Latest articles on GPT, Gemini, Claude and the AI world.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`
}, {
  maxAge: 60 * 10,
  name: 'rss-feed',
})
```

- [ ] **Step 2: Add RSS autodiscovery link to `nuxt.config.ts`**

In the `app.head.link` array, add after the existing font preconnect entries:

```typescript
{ rel: 'alternate', type: 'application/rss+xml', title: 'NeuralBriefly RSS Feed', href: '/api/rss.xml' },
```

- [ ] **Step 3: Verify the RSS feed**

```bash
npm run dev
```

Open `http://localhost:3000/api/rss.xml` in the browser. Should show valid XML with post items. Validate at https://validator.w3.org/feed/ when deployed.

- [ ] **Step 4: Commit**

```bash
git add server/api/rss.xml.ts nuxt.config.ts
git commit -m "feat: add RSS 2.0 feed at /api/rss.xml"
```

---

## Task 6: Author Pages

**Files:**
- Create: `app/pages/author/[slug].vue`
- Modify: `app/components/blog/BlogDetail.vue`

- [ ] **Step 1: Create `app/pages/author/[slug].vue`**

```vue
<script setup lang="ts">
const { $wp } = useNuxtApp()
const route = useRoute()

const page = computed(() => Number(route.query.page ?? 1))

const { data: author } = await useAsyncData(
  `author-${route.params.slug}`,
  () => $wp.getAuthorBySlug(route.params.slug as string)
)

const { data, refresh } = await useAsyncData(
  () => `author-posts-${route.params.slug}-${page.value}`,
  async () => {
    if (!author.value) return null
    return $wp.getPostsByAuthor(author.value.id, page.value)
  }
)

watch(page, () => refresh())

const posts = computed(() => data.value?.items ?? [])
const totalPages = computed(() => data.value?.totalPages ?? 1)
const total = computed(() => data.value?.total ?? 0)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <template v-if="author">
      <SeoHead :seo="{
        title: `${author.name} – NeuralBriefly`,
        description: author.description || `Articles by ${author.name} on NeuralBriefly.`,
        ogImage: author.avatarUrl ?? undefined,
        ogType: 'website',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: author.name, url: `/author/${route.params.slug}` },
        ],
      }" />

      <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: author.name }]" />

      <!-- Author header -->
      <div class="flex items-start gap-5 mb-10 pb-8 border-b border-gray-100 dark:border-white/[0.06]">
        <img
          v-if="author.avatarUrl"
          :src="author.avatarUrl"
          :alt="author.name"
          class="w-16 h-16 rounded-full flex-shrink-0 bg-gray-200 dark:bg-[#1a1a1a]"
        />
        <div v-else class="w-16 h-16 rounded-full flex-shrink-0 bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-xl font-black text-gray-500 dark:text-gray-400">
          {{ author.name[0]?.toUpperCase() }}
        </div>
        <div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{{ author.name }}</h1>
          <p v-if="author.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{{ author.description }}</p>
          <p class="text-[11px] font-bold uppercase tracking-[2px] text-gray-400 dark:text-gray-500 mt-2">{{ total }} article{{ total !== 1 ? 's' : '' }}</p>
        </div>
      </div>

      <BlogList :posts="posts" />
      <Pagination :current-page="page" :total-pages="totalPages" />
    </template>
    <p v-else class="text-gray-500 dark:text-gray-400">Author not found.</p>
  </div>
</template>
```

- [ ] **Step 2: Make author name in `BlogDetail.vue` a link**

Find the meta row in the hero overlay (line ~39 in the original) and replace the plain `<span>` for author name with a `<NuxtLink>`:

```vue
<NuxtLink
  :to="`/author/${post.authorSlug}`"
  class="font-medium text-white/90 hover:text-white transition-colors"
>
  {{ post.author.name }}
</NuxtLink>
```

- [ ] **Step 3: Add ISR rules for new routes in `nuxt.config.ts`**

In `routeRules`, add:
```typescript
'/tag/**': { isr: 120 },
'/author/**': { isr: 120 },
'/search': { ssr: true },
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Open a blog post and click the author name in the hero. Should navigate to `/author/[slug]` showing their bio and posts.

- [ ] **Step 5: Commit**

```bash
git add app/pages/author/[slug].vue app/components/blog/BlogDetail.vue nuxt.config.ts
git commit -m "feat: add author pages and link author names in blog posts"
```

---

## Task 7: SEO Fixes and robots.txt

**Files:**
- Create: `public/robots.txt`
- Verify: `app/models/PostModel.ts` (dateModified — already wired in Wave 1 Task 5)

- [ ] **Step 1: Verify dateModified is wired in PostModel**

Run:
```bash
npm test
```

The test `sets seo.article.modifiedTime from modifiedDate` should already be passing from Wave 1 Task 5. If it passes, `dateModified` is already flowing into `useSeo`'s Article JSON-LD — no further changes needed.

- [ ] **Step 2: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://neuralbriefly.com/sitemap.xml
```

- [ ] **Step 3: Verify robots.txt is served**

```bash
npm run dev
```

Open `http://localhost:3000/robots.txt`. Should return the file contents.

- [ ] **Step 4: Run all tests one final time**

```bash
npm test
```

Expected: All 13 tests pass.

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt
git commit -m "feat: add robots.txt with sitemap reference"
```

---

## All Waves Complete

Final verification:

```bash
npm test
npm run build
```

Both should succeed with no errors.

### Full feature checklist

**Wave 1**
- [ ] `/blog` — paginated post listing with list/grid toggle
- [ ] `/blog/[slug]` — breadcrumb + reading progress bar
- [ ] `/category/[slug]` — breadcrumb + pagination
- [ ] `/tag/[slug]` — tag posts with pagination
- [ ] Post tags are clickable links to tag pages
- [ ] `/search?q=gpt` — search results with pagination
- [ ] Header search icon opens instant search modal

**Wave 2**
- [ ] Share buttons (X, LinkedIn, copy) appear on every post
- [ ] Related posts section shows after comments
- [ ] Comments list loads on every post
- [ ] Comment form submits and shows moderation message

**Wave 3**
- [ ] Reading progress bar fills as you scroll a post
- [ ] `/api/rss.xml` returns valid RSS 2.0
- [ ] Author names in posts link to `/author/[slug]`
- [ ] `/author/[slug]` shows author bio and paginated posts
- [ ] `robots.txt` is served at root
- [ ] `dateModified` appears in Article JSON-LD (verify with Google Rich Results Test)

### WordPress settings to enable before going live
1. WP Admin → Settings → Discussion → "Allow people to post comments on new articles" ✓
2. Optionally: Settings → Discussion → "Before a comment appears: Comment must be manually approved" (keep enabled for spam protection)
