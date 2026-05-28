# AI Blog – Claude Instructions

## ⚠️ Core Rules (Read First)

1. **Only change what is explicitly asked.** Do not refactor, rename, restructure, or "clean up" surrounding code.
2. **Never touch unrelated files.** If asked to change a font size in one component, only edit that component.
3. **Never add features, abstractions, or improvements** that weren't requested.
4. **Match exactly** — font sizes, weights, colors, spacing values must match what the user specifies precisely.
5. **Ask before making large structural changes.** If a request could be interpreted multiple ways, confirm before acting.
6. **No auto-commits.** Never run `git add/commit/push` unless the user explicitly says "commit" or "push".

---

## Typography

See [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) for all font rules.

**Quick reference:**
- Body / headings: `Playfair Display`, serif, `font-weight: 200`
- UI / labels / meta: `Inter`, sans-serif
- Category labels: `.cat-label` class → Inter, `font-weight: 600`, `letter-spacing: 1px`
- Hero titles: `.hero-title` class → `1.4rem` mobile / `1.625rem` desktop, `font-weight: 100`
- Blog detail title: `.post-title` class → `2rem` mobile / `2.6rem` desktop

---

## Design Rules

### Color Palette
Primary accent: `#4bc471` (green) — used for all buttons, borders, and interactive highlights.

**Light mode:** white backgrounds, `text-gray-900` body text, `text-gray-500/400` secondary.
**Dark mode:** `#0D0D0D`/`#111` backgrounds, `text-white` body text, `text-gray-400/500` secondary.

**Interactive elements:**
- Hover on text links: `hover:text-gray-900 dark:hover:text-white`
- Active nav: `!text-gray-900 dark:!text-white !border-gray-900 dark:!border-white`
- CTA buttons (filled): `bg-primary text-white hover:bg-primary/80`
- CTA buttons (outlined): `border border-primary text-primary hover:bg-primary hover:text-white`
- Active states (pagination, toggles): `bg-primary text-white border-primary`
- Accent underlines / decorative bars: `border-primary` / `bg-primary`
- Category labels on image overlays: `text-white`
- Category labels on light/card backgrounds: `text-gray-500 dark:text-gray-400`

**Never use:** any orange hex values or `hover:bg-orange-*`.

---

## Global CSS Utility Classes (`main.css`)

| Class | Purpose |
|-------|---------|
| `.img-card` | `border-radius: 8px; overflow: hidden` on all post/card images |
| `.cat-label` | Inter font, `font-weight: 600`, `letter-spacing: 1px` on all category badges |
| `.wp-article` | Prose styles for WordPress content in BlogDetail |

---

## Tech Stack
- **Framework:** Nuxt 4 + Tailwind CSS
- **CMS:** WordPress REST API (headless)
- **Package manager:** `npm` (always use npm, never yarn or bun)
- **TypeScript:** interface-driven — models in `app/models/`, interfaces in `app/interfaces/`

## Key Files
| Path | Purpose |
|------|---------|
| `app/pages/index.vue` | Home / landing page |
| `app/pages/blog/[slug].vue` | Single post page |
| `app/components/blog/BlogDetail.vue` | Post detail layout |
| `app/components/blog/WpContent.vue` | WordPress HTML content viewer |
| `app/components/blog/BlogCard.vue` | Card used in grids |
| `app/components/ui/AppHeader.vue` | Site header |
| `app/assets/css/main.css` | Global CSS utilities |
| `app/services/WordPressService.ts` | All WP API calls |
| `tailwind.config.js` | Design tokens (font family) |
