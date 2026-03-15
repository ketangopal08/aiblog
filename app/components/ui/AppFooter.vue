<script setup lang="ts">
const COLUMNS = [
  {
    heading: 'AI Models',
    links: [
      { label: 'GPT Overview',       to: '/category/gpt' },
      { label: 'Prompt Engineering', to: '/category/gpt' },
      { label: 'GPT Use Cases',      to: '/category/gpt' },
      { label: 'OpenAI News',        to: '/category/gpt' },
    ],
  },
  {
    heading: 'Claude',
    links: [
      { label: 'Claude Guides',      to: '/category/claude' },
      { label: 'Claude vs Others',   to: '/category/claude' },
      { label: 'Anthropic News',     to: '/category/claude' },
      { label: 'Safety & Alignment', to: '/category/claude' },
    ],
  },
  {
    heading: 'Gemini',
    links: [
      { label: 'Gemini Basics',   to: '/category/gemini' },
      { label: 'Multimodal AI',   to: '/category/gemini' },
      { label: 'Google AI News',  to: '/category/gemini' },
      { label: 'Gemini vs GPT',   to: '/category/gemini' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',   to: '/about' },
      { label: 'Contact',    to: '/about' },
      { label: 'Newsletter', to: '/' },
      { label: 'Advertise',  to: '/about' },
    ],
  },
]
</script>

<template>
  <footer class="bg-[#0a0a0a] border-t border-[#1f1f1f]">
    <div class="max-w-[1200px] mx-auto px-8">

      <!-- Brand row -->
      <div class="flex justify-between items-start gap-10 pt-12 pb-10">
        <div>
          <NuxtLink to="/" class="text-[20px] font-black text-white tracking-tight">
            theintelli<span class="text-primary">prompt</span>
          </NuxtLink>
          <p class="text-[12px] text-[#555] mt-1.5">Your AI intelligence, daily.</p>

          <!-- Socials -->
          <div class="flex items-center gap-3 mt-4">
            <a href="#" aria-label="X / Twitter"
               class="w-8 h-8 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-white hover:border-white transition">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram"
               class="w-8 h-8 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-white hover:border-white transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook"
               class="w-8 h-8 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-white hover:border-white transition">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Link columns -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 py-9 border-b border-[#1a1a1a]">
        <div v-for="col in COLUMNS" :key="col.heading">
          <h4 class="text-[10px] font-bold text-white uppercase tracking-[2px] mb-3.5">
            {{ col.heading }}
          </h4>
          <ul class="flex flex-col">
            <li v-for="link in col.links" :key="link.label">
              <NuxtLink :to="link.to" class="block text-[12px] text-[#555] hover:text-white transition mb-2.5">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="text-center text-[11px] text-[#3a3a3a] py-6">
        &copy; {{ new Date().getFullYear() }} theintelliprompt. All Rights Reserved.
        <a href="#" class="hover:text-[#666] transition ml-2">Terms of Service</a>
        <a href="#" class="hover:text-[#666] transition ml-2">Privacy Policy</a>
      </div>

    </div>
  </footer>
</template>
