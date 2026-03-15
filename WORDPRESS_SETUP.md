# WordPress Headless CMS Setup Guide

This guide walks you through setting up WordPress as a headless CMS for this Nuxt 4 blog.

---

## Step 1 — Host & Install WordPress

You need a server to run WordPress. Choose one option:

### Option A: Local (for development)
Install [LocalWP](https://localwp.com/) — free, no terminal needed.
1. Download and install LocalWP
2. Click **+ Create a new site**
3. Name it (e.g. `aiblog`)
4. Choose PHP 8.2, MySQL, Nginx
5. Click **Finish** — WordPress installs automatically
6. Click **Open Site** to verify it works
7. Your local URL will be something like `http://aiblog.local`

### Option B: Shared Hosting (production)
Recommended hosts with 1-click WordPress install:
- [Cloudways](https://cloudways.com) (best performance)
- [SiteGround](https://siteground.com)
- [Hostinger](https://hostinger.com)

Steps vary by host but all have a **WordPress** button in their dashboard. Install and note your site URL.

---

## Step 2 — WordPress Admin Setup

1. Open your WordPress admin: `http://YOUR-SITE.com/wp-admin`
2. Log in with the credentials you set during install

### Configure Permalinks (required for REST API slugs)
1. Go to **Settings → Permalinks**
2. Select **Post name** (`/%postname%/`)
3. Click **Save Changes**

> Without this, the REST API will not return slugs correctly.

---

## Step 3 — Enable CORS on WordPress

Your Nuxt app runs on a different origin (e.g. `localhost:3000`) and WordPress will block requests without CORS headers.

### Add CORS headers to your theme's `functions.php`

1. In WordPress admin, go to **Appearance → Theme File Editor**
2. Select `functions.php` on the right sidebar
3. Add this at the bottom:

```php
// Allow REST API requests from the Nuxt frontend
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $allowed_origins = [
            'http://localhost:3000',      // Nuxt dev server
            'https://your-nuxt-site.com', // Your production domain — update this
        ];

        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }

        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        return $value;
    });
}, 15);
```

4. Click **Update File**

> Replace `https://your-nuxt-site.com` with your actual production domain before deploying.

---

## Step 4 — Create Categories

Your Nuxt app filters posts by category. Set these up first before writing posts.

1. Go to **Posts → Categories**
2. Create your categories, for example:
   - GPT
   - Gemini
   - Claude
   - AI World
3. For each category fill in:
   - **Name**: Display name (e.g. `Claude`)
   - **Slug**: URL-friendly (e.g. `claude`) — must match nav links in `AppHeader.vue`

---

## Step 5 — Write Your First Post

1. Go to **Posts → Add New**
2. Fill in:
   - **Title**: Your post title
   - **Body**: Your content (use the block editor)
   - **Excerpt**: Short summary (shown in cards) — find it under the post editor in the right panel under **Summary**
   - **Featured Image**: Set one — find it in the right panel under **Featured image** (used as the hero image in `BlogDetail.vue`)
   - **Categories**: Select a category from the right panel
   - **Tags**: Add tags from the right panel (optional)
3. Click **Publish**

> If you skip the featured image, the app falls back to a placeholder from picsum.photos.

---

## Step 6 — Verify the REST API

Open these URLs in your browser to confirm the API is working:

```
# All posts
http://YOUR-SITE.com/wp-json/wp/v2/posts?_embed

# Single post by slug
http://YOUR-SITE.com/wp-json/wp/v2/posts?slug=your-post-slug&_embed

# All categories
http://YOUR-SITE.com/wp-json/wp/v2/categories?hide_empty=true
```

You should see JSON responses. If you see a 404, go back to Step 2 and re-save your Permalinks.

---

## Step 7 — Connect to Your Nuxt App

1. Open `.env` in the root of this project
2. Set your WordPress site URL:

```env
WP_BASE_URL=http://YOUR-SITE.com
```

For LocalWP it will be something like:
```env
WP_BASE_URL=http://aiblog.local
```

3. Restart your Nuxt dev server:

```bash
npm run dev
```

The app will now fetch real posts from WordPress instead of mock data.

---

## Step 8 — Set a Featured Post on the Home Page

The home page (`app/pages/index.vue`) looks for a post with this exact slug to feature prominently:

```
claude-constitutional-ai-explained
```

Either:
- **Option A**: Create a post and set its slug to `claude-constitutional-ai-explained`
- **Option B**: Change the slug in `index.vue` to match one of your actual post slugs

To change it, open `app/pages/index.vue` and find:
```js
const featuredPost = computed(() =>
  posts.value.find(p => p.slug === 'claude-constitutional-ai-explained') ?? posts.value[0]
)
```
Replace `'claude-constitutional-ai-explained'` with your preferred post slug.

---

## Step 9 — Production Checklist

Before going live, verify the following:

- [ ] `WP_BASE_URL` in `.env` points to your live WordPress domain
- [ ] CORS `functions.php` code includes your production Nuxt domain
- [ ] All categories created with slugs matching the nav links in `AppHeader.vue`
- [ ] Permalinks set to **Post name** on the live WordPress install
- [ ] At least one post published with a featured image and category set
- [ ] REST API URL returns JSON: `https://YOUR-SITE.com/wp-json/wp/v2/posts?_embed`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| API returns 404 | Re-save Permalinks (Step 2) |
| CORS error in browser | Check `functions.php` has your Nuxt origin (Step 3) |
| Posts show but no images | Set a Featured Image on the post in WordPress |
| Mock data still showing | Check `.env` has real `WP_BASE_URL` and restart `npm run dev` |
| Categories not filtering | Ensure category slugs match exactly what's used in nav/route params |
