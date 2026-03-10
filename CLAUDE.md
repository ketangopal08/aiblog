# AI Blog – Claude Instructions

## Design Rules

### Primary Color
The project primary color is `#ff5811` (orange).
It is registered in `tailwind.config.js` as `primary` → use `text-primary`, `bg-primary`, `border-primary`, `hover:text-primary`, etc.

**Use primary color ONLY for:**
- Link text and hover states (`text-primary`, `hover:text-primary`)
- Active / selected nav items
- CTA buttons and interactive highlights

**Do NOT use primary color for:**
- Tag pills (use neutral gray: `bg-gray-100 dark:bg-[#1f1f1f] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2d2d2d]`)
- Decorative borders or underline accents on overlay cards (use `border-white/60` on dark backgrounds)
- Category label text on image overlays (use `text-white`)

**Never use raw hex values** in templates or style attributes. Always use the Tailwind `primary` token for the cases above.

---

### Post Standard Format
Every blog post page (`BlogDetail.vue`) must follow this structure in order:

1. **Hero image** — full-width, rounded, cinematic height (`clamp(260px, 45vw, 500px)`), with layered dark gradients
2. **Overlay content** (bottom of hero image):
   - Category badges — `bg-primary text-white` rounded-full pills
   - Post title — large, bold, white, `line-clamp-3`
   - Meta row — author name · formatted date · reading time (clock icon)
3. **Article body** — `v-html="post.content"`, `text-gray-800 dark:text-gray-200`, `leading-relaxed space-y-4`
4. **Tags section** — separated by a top border, `#tag` pills using `text-primary` or `border-primary`
5. **Back link** — `← Back to all posts` in `text-primary font-bold uppercase`

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
| `tailwind.config.js` | Design tokens (primary color etc.) |

## Color Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#ff5811` | Links, tags, highlights, borders, active states — use everywhere |
