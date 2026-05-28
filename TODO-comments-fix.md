# Fix: WordPress Comments Authentication

## Problem
Comments on blog posts return "Sorry, you must be logged in to comment." because the WordPress REST API blocks anonymous submissions by default.

## Solution
Route comment submissions through a Nuxt server API proxy that authenticates with WordPress via Application Password. Credentials stay server-side and are never exposed to the browser.

## Status
- [x] Nuxt server route created: `server/api/comment.post.ts`
- [x] `PostComments.vue` updated to call `/api/comment` instead of WordPress directly
- [x] `nuxt.config.ts` updated with `wpAppUser` / `wpAppPassword` runtimeConfig keys
- [ ] WordPress Application Password created
- [ ] `.env` updated with real credentials

---

## Steps To Complete

### 1. Create WordPress Application Password
1. Log in to WordPress Admin
2. Go to **Users → Profile** (your admin account)
3. Scroll to the **Application Passwords** section
4. Enter name: `Nuxt Blog` → click **Add New Application Password**
5. Copy the generated password (shown only once — looks like `AbCd EfGh IjKl MnOp QrSt UvWx`)

### 2. Update `.env`
Open `/repos/aiblog/.env` and fill in:
```
WP_APP_USER=your_actual_wp_admin_username
WP_APP_PASSWORD=AbCd EfGh IjKl MnOp QrSt UvWx
```

### 3. Restart Dev Server
```bash
npm run dev
```

### 4. Test
- Go to any blog post
- Fill in name, email, comment → click Post Comment
- Should succeed and show "awaiting moderation" message

### 5. Deploy
Make sure the environment variables are also set on your production/hosting environment (Hostinger), not just locally.

---

## Files Already Changed
| File | Change |
|------|--------|
| `server/api/comment.post.ts` | New proxy route — forwards comment to WP with Basic auth |
| `app/components/blog/PostComments.vue` | Calls `/api/comment` instead of `$wp.postComment` |
| `nuxt.config.ts` | Added `wpAppUser` and `wpAppPassword` to private runtimeConfig |
| `.env` | Placeholder lines added — replace with real values |
