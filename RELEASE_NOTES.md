# Release Notes — NeuralBriefly AI Blog

---

## v1.3.0 — Wave 1 Complete (2026-05-26)

### New Features
- **Blog index page** (`/blog`) — list/grid toggle, skeleton loading, ISR-cached
- **Search** — debounced search modal (keyboard shortcut, ESC to close) + dedicated `/search` results page (noindex)
- **Tag pages** (`/tag/[slug]`) — paginated posts filtered by tag
- **Pagination component** — smart window algorithm, URL-driven (`?page=N`), hidden when single page
- **Breadcrumb nav** — Home → Category → Post on post detail pages; Home → Category on category pages
- **Category pages** — now paginated and reactive

### Improvements
- **Font system** — Playfair Display as primary body font; Inter 14px on nav links and sidebar headings; all headings `font-weight: 500`, `font-size: 26px`
- **Section order** — AI Stories section above Newsletter section on homepage
- **Tag links** — tags on post detail pages now link to `/tag/[slug]`

### Data Layer
- `WordPressService` — added `getPostsPaginated`, `searchPosts`, `getPostsByTag`, `getPostsByTagPaginated`, `getPostsByAuthor`, `getComments`
- `IWordPressService` — extended with all new method signatures
- `IPaginatedResult<T>` and `IComment` interfaces added
- `PostModel` — added `modifiedDate`, `authorSlug`, `seo.breadcrumbs`
- Pagination utility (`app/utils/pagination.ts`) with 5 unit tests

### Bug Fixes
- `WPComment.author_avatar_urls` made optional (absent from some WP API responses)
- Breadcrumb JSON-LD uses `CollectionPage` schema, length guard fixed
- `ISeo.breadcrumb` migrated to `breadcrumbs` array, second JSON-LD block emitted

---

## v1.2.0 — Homepage & Design System (2026-05-23)

### New Features
- **MoreStories section** — list/grid toggle, ad sidebar with sticky scroll, view more link
- **Newsletter slider** — full-width CTA section
- **Mock data toggle** — `WP_USE_MOCK` env flag for local development without a live WordPress API
- **ISR caching** — route rules for `/`, `/blog`, `/blog/**`, `/category/**`

### Design
- Monochrome black/white design system (removed all orange/accent colors)
- Sticky glass nav — brand left, links center, search + theme toggle right
- Homepage hero grid — large featured post + 2 stacked cards + trending sidebar
- Max-width standardised to `1238px` across all sections

### Infrastructure
- Vitest test infrastructure added (`tests/unit/`)
- `useWordPress` composable wiring WordPress plugin

---

## v1.1.0 — SEO & Foundation (2026-05-22)

### New Features
- **SEO foundation** — `useSeo` composable, JSON-LD Article + BreadcrumbList schemas
- **Sitemap** — auto-generated via `@nuxtjs/sitemap`
- **Error page** — custom `error.vue`
- `SeoHead.vue` component accepting `ISeo` prop

### Improvements
- AppHeader redesigned — editorial masthead, scroll-aware sticky nav, mobile drawer
- AppFooter redesigned — 4-column layout
- BlogCard redesigned — reading time badge, minimal style
- Homepage restructured — 3-col hero grid, latest posts strip, newsletter CTA

### Bug Fixes
- IntersectionObserver teardown fixed in AppHeader
- `try/catch` on all WordPress API calls (graceful degradation on API failure)
- Accessibility — `aria-label` on all interactive buttons and inputs

---

## v1.0.0 — Initial Release (2026-05-20)

- Nuxt 4 + Tailwind CSS + TypeScript project scaffolded
- WordPress REST API integration (headless CMS)
- Interface-driven architecture: `app/interfaces/`, `app/models/`, `app/services/`
- Dark mode support via `class` strategy
- Basic blog listing and post detail pages
- Google Fonts integration (Playfair Display + Inter)
