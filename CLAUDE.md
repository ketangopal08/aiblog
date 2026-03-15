# AI Blog – Claude Instructions

## Design Rules

### Color Palette
Monochrome — black and white only. No accent color.

**Light mode:** white backgrounds, `text-gray-900` body text, `text-gray-500/400` secondary.
**Dark mode:** `#0D0D0D`/`#111` backgrounds, `text-white` body text, `text-gray-400/500` secondary.

**Interactive elements:**
- Hover on text links: `hover:text-gray-900 dark:hover:text-white`
- Active nav: `!text-gray-900 dark:!text-white !border-gray-900 dark:!border-white`
- CTA buttons (light bg): `bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200`
- CTA buttons (dark bg, e.g. newsletter): `bg-white text-gray-900 hover:bg-gray-100`
- Category labels on image overlays: `text-white`
- Category labels on light/card backgrounds: `text-gray-500 dark:text-gray-400`

**Never use:** `text-primary`, `bg-primary`, any orange hex values, or `hover:bg-orange-*`.

---

### Post Standard Format
Every blog post page (`BlogDetail.vue`) must follow this structure in order:

1. **Hero image** — full-width, rounded, cinematic height (`clamp(260px, 45vw, 500px)`), with layered dark gradients
2. **Overlay content** (bottom of hero image):
   - Category badges — `bg-gray-900/80 text-white` rounded-full pills
   - Post title — large, bold, white, `line-clamp-3`
   - Meta row — author name · formatted date · reading time (clock icon)
3. **Article body** — `v-html="post.content"`, `text-gray-800 dark:text-gray-200`, `leading-relaxed space-y-4`
4. **Tags section** — separated by a top border, `#tag` pills using neutral gray
5. **Back link** — `← Back to all posts` in `text-gray-900 dark:text-white font-bold uppercase`

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
| `app/components/blog/BlogCard.vue` | Card used in grids |
| `app/components/ui/AppHeader.vue` | Site header |
| `app/services/WordPressService.ts` | All WP API calls |
| `tailwind.config.js` | Design tokens (font family) |
