<script setup lang="ts">
const primaryLinks = [
  { label: 'About Us',   to: '/about' },
  { label: 'Contact',    to: '/contact' },
  { label: 'Advertise',  to: '/advertise' },
  { label: 'Newsletter', to: '/newsletter' },
  { label: 'News',       to: '/category/news' },
  { label: 'How-to',     to: '/category/how-to' },
  { label: 'Features',   to: '/category/features' },
]

const secondaryLinks = [
  { label: 'Terms of Service', to: '#' },
  { label: 'Privacy Policy',   to: '#' },
  { label: 'Cookie Policy',    to: '#' },
]
</script>

<template>
  <footer class="bg-[#0a0a0a]">
    <div class="max-w-[1238px] mx-auto px-6 sm:px-8 py-10">

      <!-- Row 1: Logo + Socials -->
      <div class="flex items-center justify-between mb-7">
        <NuxtLink to="/"
          class="text-white leading-none"
          style="font-size: 44px; font-family: 'Playfair Display', serif !important; font-weight: 200 !important; letter-spacing: 1px">
          NeuralBriefly
        </NuxtLink>

        <div class="flex items-center gap-3">
          <a href="#" aria-label="Facebook"
             class="w-9 h-9 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </a>
          <a href="#" aria-label="X / Twitter"
             class="w-9 h-9 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" aria-label="Instagram"
             class="w-9 h-9 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="#" aria-label="YouTube"
             class="w-9 h-9 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
            </svg>
          </a>
          <a href="/api/rss.xml" aria-label="RSS Feed"
             class="w-9 h-9 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.18 15.64a2.18 2.18 0 012.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 012.18-2.18M4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44m0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93V10.1z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Row 2: Primary nav links -->
      <nav class="mb-3 leading-relaxed">
        <template v-for="(link, i) in primaryLinks" :key="link.label">
          <NuxtLink :to="link.to"
            class="inline text-[13px] text-[#aaa] hover:text-white transition-colors whitespace-nowrap">
            {{ link.label }}
          </NuxtLink>
          <span v-if="i < primaryLinks.length - 1" class="inline mx-3 text-[#444] select-none">|</span>
        </template>
      </nav>

      <!-- Row 3: Secondary links -->
      <nav class="mb-6 leading-relaxed">
        <template v-for="(link, i) in secondaryLinks" :key="link.label">
          <NuxtLink :to="link.to"
            class="inline text-[12px] text-[#555] hover:text-[#aaa] transition-colors whitespace-nowrap">
            {{ link.label }}
          </NuxtLink>
          <span v-if="i < secondaryLinks.length - 1" class="inline mx-3 text-[#333] select-none">|</span>
        </template>
      </nav>

      <!-- Row 4: Copyright -->
      <p class="text-[11px] text-[#444] uppercase tracking-wide">
        &copy; {{ new Date().getFullYear() }} NeuralBriefly. All Rights Reserved.
      </p>

    </div>
  </footer>
</template>
