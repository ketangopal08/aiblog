<script setup lang="ts">
const primaryLinks = [
  { label: 'About Us',   to: '/about' },
  { label: 'Contact',    to: '/contact' },
  { label: 'Advertise',  to: '/advertise' },
  { label: 'News',       to: '/category/news' },
  { label: 'How-to',     to: '/category/how-to' },
  { label: 'Features',   to: '/category/features' },
]

const secondaryLinks = [
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Privacy Policy',   to: '/privacy' },
  { label: 'Cookie Policy',    to: '/cookie-policy' },
]
</script>

<template>
  <footer class="bg-[#0a0a0a] overflow-hidden">
    <div class="max-w-[1238px] mx-auto px-5 sm:px-8 py-10">

      <!-- Row 1: Logo + Socials -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <NuxtLink to="/"
          class="text-white leading-none"
          style="font-size: clamp(28px, 6vw, 44px); font-family: 'Playfair Display', serif !important; font-weight: 200 !important; letter-spacing: 1px">
          NeuralBriefly
        </NuxtLink>

        <div class="flex items-center gap-2 flex-wrap">
          <a href="#" aria-label="Facebook"
             class="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </a>
          <a href="#" aria-label="X / Twitter"
             class="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" aria-label="Instagram"
             class="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn"
             class="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Row 2: Primary nav links -->
      <nav class="mb-3 leading-relaxed">
        <template v-for="(link, i) in primaryLinks" :key="link.label">
          <NuxtLink :to="link.to"
            class="inline text-[13px] text-white hover:text-white/70 transition-colors">
            {{ link.label }}
          </NuxtLink>
          <span v-if="i < primaryLinks.length - 1" class="inline mx-3 text-white/20 select-none">|</span>
        </template>
      </nav>

      <!-- Row 3: Secondary links -->
      <nav class="mb-6 leading-relaxed">
        <template v-for="(link, i) in secondaryLinks" :key="link.label">
          <NuxtLink :to="link.to"
            class="inline text-[12px] text-white/70 hover:text-white transition-colors">
            {{ link.label }}
          </NuxtLink>
          <span v-if="i < secondaryLinks.length - 1" class="inline mx-3 text-white/15 select-none">|</span>
        </template>
      </nav>

      <!-- Row 4: Copyright -->
      <p class="text-[11px] text-[#444] uppercase tracking-wide">
        &copy; {{ new Date().getFullYear() }} NeuralBriefly. All Rights Reserved.
      </p>

    </div>
  </footer>
</template>
