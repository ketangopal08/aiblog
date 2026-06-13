<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <SeoHead :seo="{
      title: 'About NeuralBriefly – AI News & Analysis',
      description: 'NeuralBriefly is your daily source for AI news, model breakdowns, and practical guides on GPT, Claude, Gemini and beyond.',
      ogType: 'website',
    }" />

    <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'About Us' }]" />

    <!-- Hero -->
    <div class="mb-12">
      <h1 class="text-[2.2rem] sm:text-[3rem] font-bold text-gray-900 dark:text-white leading-tight mb-4">
        We cover AI so you don't have to scroll for hours.
      </h1>
      <p class="text-[17px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
        NeuralBriefly is an independent publication tracking the fast-moving world of artificial intelligence — from model releases and research breakthroughs to practical how-tos and product updates.
      </p>
    </div>

    <hr class="border-gray-100 dark:border-white/[0.08] my-12" />

    <!-- Mission -->
    <section class="mb-12">
      <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-4">Our Mission</h2>
      <p class="text-[16px] text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        AI is moving faster than any single person can follow. New models ship weekly, research papers drop daily, and product announcements get buried in noise. We cut through that — publishing clear, opinionated coverage of what actually matters.
      </p>
      <p class="text-[16px] text-gray-700 dark:text-gray-300 leading-relaxed">
        Every article on NeuralBriefly is written to be useful: practical guides you can apply today, comparisons that answer real questions, and news summaries that respect your time.
      </p>
    </section>

    <!-- What we cover -->
    <section class="mb-12">
      <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-6">What We Cover</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="topic in topics" :key="topic.title"
             class="border border-gray-100 dark:border-white/[0.08] p-5">
          <div class="text-primary mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="topic.icon" />
            </svg>
          </div>
          <h3 class="text-[14px] font-bold text-gray-900 dark:text-white mb-1">{{ topic.title }}</h3>
          <p class="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">{{ topic.desc }}</p>
        </div>
      </div>
    </section>

    <hr class="border-gray-100 dark:border-white/[0.08] my-12" />

    <!-- CTA -->
    <section class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div class="flex-1">
        <p class="text-[16px] font-bold text-gray-900 dark:text-white mb-1">Want to get in touch?</p>
        <p class="text-[14px] text-gray-500 dark:text-gray-400">For editorial inquiries, partnerships, or advertising opportunities.</p>
      </div>
      <div class="flex gap-3 flex-shrink-0">
        <NuxtLink to="/contact"
          class="px-5 py-2.5 text-[12px] font-bold uppercase tracking-[1.5px] bg-primary text-white hover:bg-primary/80 transition-colors">
          Contact Us
        </NuxtLink>
        <NuxtLink to="/advertise"
          class="px-5 py-2.5 text-[12px] font-bold uppercase tracking-[1.5px] bg-primary text-white hover:bg-primary/80 transition-colors">
          Advertise
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const topics = [
  {
    title: 'GPT & OpenAI',
    desc: 'Model updates, API changes, product launches, and practical guides for GPT-4o and beyond.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    title: 'Claude & Anthropic',
    desc: 'Constitutional AI, safety research, Claude model releases, and how Anthropic shapes the field.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Gemini & Google',
    desc: 'Multimodal AI, DeepMind research, Gemini model comparisons, and Google\'s AI strategy.',
    icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9',
  },
  {
    title: 'How-to & Guides',
    desc: 'Step-by-step tutorials, prompt engineering tips, and developer resources for building with AI.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
]
</script>
