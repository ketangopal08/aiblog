# NeuralBriefly – Typography System

## Global Defaults (`app/assets/css/main.css`)

| Rule | Value |
|------|-------|
| Primary font | `Playfair Display`, serif |
| Secondary font | `Inter`, sans-serif |
| Body font | Playfair Display (set on `body`) |
| Global h1–h6 font-size | `26px !important` |
| Global h1–h6 font-weight | `500 !important` |

---

## Global CSS Utility Classes

```css
.cat-label  { font-family: 'Inter', sans-serif !important; font-weight: 600 !important; letter-spacing: 1px; }
.img-card   { border-radius: 8px; overflow: hidden; }
.hero-title { font-size: 1.4rem !important; font-weight: 100 !important; line-height: 1.2 !important; }
.post-title { font-size: 2rem !important; }           /* mobile */
              /* font-size: 2.6rem !important; */      /* desktop ≥1024px */
.wp-article { font-size: 1.1rem; }                    /* mobile */
              /* font-size: 1.125rem; */               /* desktop ≥1024px */
.wp-article a { color: #4bc471 !important; }
```

---

## Section-by-Section Rules

### 1. App Header (`AppHeader.vue`)

| Element | Font Family | Size | Weight | Letter Spacing | Notes |
|---------|-------------|------|--------|----------------|-------|
| Desktop brand "NeuralBriefly" | Playfair Display | 22px | 200 | 1px | |
| Mobile brand "NeuralBriefly" | Playfair Display | 1.1rem | 200 | 1px | |
| Desktop nav links | Playfair Display | 16px | 100 | — | scoped `.nav-links a` |
| Desktop nav separators `/` | — | 16px | — | — | |
| Search / icon buttons | — | 14px (icon) | — | — | |
| **Fullscreen menu nav links** | Playfair Display | clamp(2rem, 6vw, 3.5rem) | 200 | -0.5px | |
| Fullscreen menu category links | Inter | 12px | — | tracking-widest | uppercase |
| Fullscreen menu theme toggle | Inter | 13px | — | — | |

---

### 2. App Footer (`AppFooter.vue`)

| Element | Font Family | Size | Weight | Letter Spacing | Notes |
|---------|-------------|------|--------|----------------|-------|
| Brand "NeuralBriefly" | Playfair Display | clamp(28px, 6vw, 44px) | 200 | 1px | |
| Primary nav links | — | 13px | — | — | color: #aaa |
| Secondary nav links | — | 12px | — | — | color: #555 |
| Copyright | — | 11px | — | tracking-wide | uppercase |

---

### 3. Home / Landing Page (`index.vue`)

| Element | Font Family | Size | Weight | Letter Spacing | Notes |
|---------|-------------|------|--------|----------------|-------|
| Hero card titles (all 3) | Playfair Display | 1.4rem → 1.625rem | 100 | -0.01em | `.hero-title` class |
| Hero card date | — | 11px / 10px | — | — | white/55 |
| Hero category badge | Inter | 9px / 8px | 300 | 2.5px / 2px | `.cat-label` + glass bg |
| Trending Stories heading | Inter | 14px | — | 1px | capitalize |
| Trending post title | — | 15px | font-medium | — | line-clamp-2 |
| Trending post date | — | 11px | — | — | |

---

### 4. Blog Detail (`BlogDetail.vue`)

| Element | Font Family | Size | Weight | Letter Spacing | Notes |
|---------|-------------|------|--------|----------------|-------|
| Category links | Inter | 13px | 400 | — | text-primary |
| Post title (h1) | Playfair Display | 2rem → 2.6rem | bold | — | `.post-title` class |
| Meta bar (all) | Inter | — | — | — | wraps author, date, share |
| Author name | Inter | 12px | font-semibold | — | |
| Post date | Inter | 11px | — | — | |
| Share button text | Inter | 11px | font-medium | — | |
| Tags | — | text-xs | — | — | bg-primary pill |
| Back link | — | text-sm | font-bold | tracking-wide | uppercase |

---

### 5. WordPress Content (`WpContent.vue`)

| Element | Font Family | Size | Weight | Notes |
|---------|-------------|------|--------|-------|
| Body text | Playfair Display (inherited) | 1.1rem → 1.125rem | — | `.wp-article` class |
| Links `<a>` | — | — | — | color: #4bc471 |
| Styled via `@tailwindcss/typography` `prose` class | | | | |

---

### 6. More Stories (`MoreStories.vue`)

| Element | Font Family | Size | Weight | Letter Spacing | Notes |
|---------|-------------|------|--------|----------------|-------|
| "AI" logo mark | Inter | 52px / 64px (sm+) | font-black | — | |
| Subtitle | — | 9px / 10px (sm+) | font-bold | 2.5px | uppercase |
| "See More" button | — | 11px | font-bold | 1.5px | |
| Category label (list/grid) | Inter | 9px | font-black | 2px | `.cat-label` |
| Post date | — | 11px | — | — | |
| List view post title | — | 15px → 18px → 20px | font-bold | — | line-clamp-2 |
| List view excerpt | — | 13px | — | — | line-clamp-2 |
| Grid view post title | — | 14px | font-bold | — | line-clamp-2 |
| Grid view date | — | 11px | — | — | |

---

### 7. Newsletter Section (`NewsletterSlider.vue`)

| Element | Font Family | Size | Weight | Letter Spacing | Notes |
|---------|-------------|------|--------|----------------|-------|
| "NEWSLETTERS" heading | Inter | clamp(24px, 3vw, 36px) | font-black | — | |
| Subtitle | — | 11px | — | 3px | uppercase |
| "See More Newsletters" button | — | 12px | font-bold | 1.5px | |
| "Coming Soon" badge | — | 10px | font-black | 3px | uppercase |
| Coming soon description | — | 13px | — | — | leading-relaxed |

---

### 8. Blog Card (`BlogCard.vue`)

| Element | Font Family | Size | Weight | Letter Spacing | Notes |
|---------|-------------|------|--------|----------------|-------|
| Category label | Inter | 10px | font-bold | tracking-widest | `.cat-label` |
| Card title | — | 15px | font-bold | -0.2px | line-clamp-2 |
| Card excerpt | — | 12px | — | — | leading-relaxed |
| Author / date | — | 11px | — | — | |

---

### 9. Related Posts (`RelatedPosts.vue`)

| Element | Font Family | Size | Weight | Letter Spacing | Notes |
|---------|-------------|------|--------|----------------|-------|
| Section header | — | 11px | font-black | 3px | uppercase |
| Post title | — | 13px | font-bold | — | line-clamp-2 |
| Post date | — | 11px | — | — | |

---

### 10. Blog Index Page (`blog/index.vue`)

| Element | Font Family | Size | Weight | Letter Spacing | Notes |
|---------|-------------|------|--------|----------------|-------|
| Page title "All Posts" | — | text-2xl → text-3xl | font-black | tracking-tight | |
| Article count | — | text-sm | — | — | |
| Category label | Inter | 9px | font-black | 2px | `.cat-label` |
| List post title | — | 15px → 18px → 20px | font-bold | — | |
| Grid post title | — | 14px | font-bold | — | |
| Date | — | 11px | — | — | |

---

### 11. Search Page (`search.vue`)

| Element | Font Family | Size | Weight | Letter Spacing | Notes |
|---------|-------------|------|--------|----------------|-------|
| Results header | — | text-2xl → text-3xl | font-black | tracking-tight | |
| No results message | — | text-base | font-semibold | — | |
| Category label | Inter | 9px | font-black | 2px | `.cat-label` |
| Post title | — | 15px → 18px | font-bold | — | line-clamp-2 |
| Excerpt | — | 13px | — | — | line-clamp-2 |
| Date | — | 11px | — | — | |

---

## Font Weight Reference

| Value | Tailwind Class | Usage |
|-------|----------------|-------|
| 100 | `font-thin` | Hero titles, desktop nav links |
| 200 | inline style | Brand logo everywhere |
| 300 | inline style | Hero category badges |
| 400 | inline style | Category links in BlogDetail |
| 500 | (global default) | h1–h6 global override |
| 600 | `font-semibold` | `.cat-label`, drawer links |
| 700 | `font-bold` | Post titles, card titles |
| 900 | `font-black` | Category badges, AI mark, section headers |

---

## Font Size Scale

| Range | Usage |
|-------|-------|
| 8–11px | Category labels, dates, badges, meta |
| 12–15px | Excerpts, secondary titles, card content |
| 16–22px | Nav links, author names, card titles |
| 1.4rem–1.625rem | Hero image titles (`.hero-title`) |
| 2rem–2.6rem | Blog detail title (`.post-title`) |
| clamp(24px–36px) | Section headings (Newsletters) |
| clamp(28px–44px) | Footer brand |
| clamp(2rem–3.5rem) | Fullscreen burger menu links |

---

## Letter Spacing Reference

| Value | Usage |
|-------|-------|
| `-0.5px` | Fullscreen menu links |
| `-0.2px` | Blog card titles |
| `1px` | Brand logos, `.cat-label`, Trending heading |
| `1.5px` | Buttons ("See More", share) |
| `2px` / `2.5px` | Category badges on cards |
| `3px` | Section headers, badges |
| `tracking-widest` | Footer copyright, category in BlogCard |
