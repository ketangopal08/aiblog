<template>
  <footer class="bg-[#0a0a0a] border-t border-[#1f1f1f]">

    <!-- ── Top: brand + newsletter ── -->
    <div class="max-w-7xl mx-auto px-6 pt-12 pb-10 flex flex-col lg:flex-row lg:items-start justify-between gap-10">

      <!-- Brand + socials -->
      <div class="flex flex-col gap-5">
        <NuxtLink to="/" class="text-xl font-black text-white tracking-tight">
          theintelliprompt
        </NuxtLink>
        <div class="flex items-center gap-3">
          <a href="#" aria-label="Instagram"
            class="w-9 h-9 rounded-full border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="#" aria-label="X / Twitter"
            class="w-9 h-9 rounded-full border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" aria-label="Facebook"
            class="w-9 h-9 rounded-full border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </a>
          <a href="#" aria-label="Threads"
            class="w-9 h-9 rounded-full border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.473 12.01v-.017c.027-3.579.877-6.433 2.525-8.482C5.845 1.207 8.6.024 12.18 0h.014c2.746.018 5.1.818 6.998 2.376 1.85 1.52 3.019 3.638 3.476 6.297l-2.fahrenheit.55.368C19.65 6.89 18.737 5.2 17.27 4.016c-1.41-1.14-3.256-1.725-5.49-1.74h-.012c-2.9.019-5.092.913-6.516 2.659-1.377 1.686-2.08 4.12-2.103 7.236v.014c.023 3.113.725 5.547 2.097 7.234 1.419 1.748 3.61 2.643 6.512 2.662h.007c2.6-.018 4.33-.643 5.518-1.963.996-1.112 1.564-2.793 1.69-5l.002-.036h-7.148v-2.27h9.6l-.003.252c-.112 3.557-1.063 6.187-2.826 7.818C17.038 23.354 14.84 24 12.186 24z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Newsletter -->
      <div class="flex flex-col gap-3 lg:w-96">
        <p class="text-white font-semibold text-sm">Subscribe to our newsletter</p>
        <form class="flex items-center border border-[#2a2a2a] rounded-full overflow-hidden bg-[#111] focus-within:border-white transition">
          <input
            type="email"
            placeholder="Enter your email here..."
            class="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-600 px-5 py-3 outline-none"
          />
          <button
            type="submit"
            class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition mr-1"
            aria-label="Subscribe"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </form>
      </div>
    </div>

    <!-- ── Divider ── -->
    <div class="border-t border-[#1a1a1a] mx-6" />

    <!-- ── Link columns ── -->
    <div class="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">

      <div v-for="col in COLUMNS" :key="col.heading">
        <h4 class="text-white text-sm font-semibold mb-4">{{ col.heading }}</h4>
        <ul class="flex flex-col gap-2.5">
          <li v-for="link in col.links" :key="link.label">
            <NuxtLink :to="link.to" class="text-gray-500 text-sm hover:text-white transition">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

    </div>

    <!-- ── Divider ── -->
    <div class="border-t border-[#1a1a1a] mx-6" />

    <!-- ── Bottom bar ── -->
    <div class="max-w-7xl mx-auto px-6 py-6 text-center text-xs text-gray-600 leading-relaxed">
      &copy; {{ new Date().getFullYear() }} theintelliprompt. All Rights Reserved.
      Use of this site constitutes acceptance of our
      <a href="#" class="hover:text-gray-400 transition">Terms of Service</a>,
      <a href="#" class="hover:text-gray-400 transition">Privacy Policy</a>.
    </div>

  </footer>
</template>

<script setup lang="ts">
const COLUMNS = [
  {
    heading: 'AI Models',
    links: [
      { label: 'GPT Overview',    to: '/category/gpt' },
      { label: 'GPT-4 Insights',  to: '/category/gpt' },
      { label: 'GPT Use Cases',   to: '/category/gpt' },
      { label: 'Prompt Engineering', to: '/category/gpt' },
    ],
  },
  {
    heading: 'Gemini',
    links: [
      { label: 'Gemini Basics',   to: '/category/gemini' },
      { label: 'Gemini vs GPT',   to: '/category/gemini' },
      { label: 'Google AI News',  to: '/category/gemini' },
      { label: 'Multimodal AI',   to: '/category/gemini' },
    ],
  },
  {
    heading: 'Claude',
    links: [
      { label: 'Claude Guides',   to: '/category/claude' },
      { label: 'Claude vs Others',to: '/category/claude' },
      { label: 'Anthropic News',  to: '/category/claude' },
      { label: 'Safety & Alignment', to: '/category/claude' },
    ],
  },
  {
    heading: 'AI World',
    links: [
      { label: 'Latest AI News',  to: '/category/ai' },
      { label: 'AI for Business', to: '/category/ai' },
      { label: 'AI Tools',        to: '/category/ai' },
      { label: 'Future of AI',    to: '/category/ai' },
    ],
  },
  {
    heading: 'Our Community',
    links: [
      { label: 'About Us',   to: '/about' },
      { label: 'Contact',    to: '/about' },
      { label: 'Newsletter', to: '/' },
      { label: 'Advertise',  to: '/about' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Prompt Library', to: '/' },
      { label: 'AI Glossary',    to: '/' },
      { label: 'Tutorials',      to: '/' },
      { label: 'Case Studies',   to: '/' },
    ],
  },
]
</script>
