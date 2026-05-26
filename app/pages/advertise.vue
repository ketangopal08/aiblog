<script setup lang="ts">
const form = reactive({ name: '', company: '', email: '', budget: '', message: '' })
const submitted = ref(false)
const submitting = ref(false)

async function submit() {
  submitting.value = true
  await new Promise(r => setTimeout(r, 800))
  submitted.value = true
  submitting.value = false
}

const packages = [
  {
    name: 'Sponsored Article',
    price: 'From $299',
    desc: 'A full editorial-style post written about your product, published in our feed and promoted in our newsletter.',
    features: ['1,000+ word article', 'SEO optimised', 'Newsletter mention', '30-day live guarantee'],
  },
  {
    name: 'Newsletter Spot',
    price: 'From $149',
    desc: 'A dedicated placement inside our weekly AI digest sent to engaged subscribers.',
    features: ['Top or mid-placement', 'Custom copy', 'Click tracking', 'Exclusive per issue'],
  },
  {
    name: 'Banner / Display',
    price: 'From $99',
    desc: 'Prominent display placements across category pages and individual post pages.',
    features: ['Sidebar or in-article', 'Mobile-responsive', 'Custom image/CTA', 'Weekly impressions report'],
  },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <SeoHead :seo="{
      title: 'Advertise with NeuralBriefly – Reach AI Enthusiasts',
      description: 'Reach a highly engaged audience of AI enthusiasts, developers, and founders. Sponsored articles, newsletter placements, and display options available.',
      ogType: 'website',
    }" />

    <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Advertise' }]" />

    <!-- Hero -->
    <div class="mb-12">
      <h1 class="text-[2rem] sm:text-[2.6rem] font-bold text-gray-900 dark:text-white leading-tight mb-3">
        Reach an AI-First Audience
      </h1>
      <p class="text-[16px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
        NeuralBriefly readers are developers, founders, and AI enthusiasts actively following the space. Advertise your product, tool, or service directly in front of them.
      </p>
    </div>

    <!-- Packages -->
    <section class="mb-14">
      <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-6">Advertising Packages</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div v-for="pkg in packages" :key="pkg.name"
             class="border border-gray-100 dark:border-white/[0.08] p-6 flex flex-col">
          <p class="text-[11px] font-black uppercase tracking-[2px] text-primary mb-2">{{ pkg.name }}</p>
          <p class="text-[22px] font-bold text-gray-900 dark:text-white mb-3">{{ pkg.price }}</p>
          <p class="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1">{{ pkg.desc }}</p>
          <ul class="flex flex-col gap-1.5">
            <li v-for="f in pkg.features" :key="f" class="flex items-center gap-2 text-[12px] text-gray-600 dark:text-gray-400">
              <svg class="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              {{ f }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <hr class="border-gray-100 dark:border-white/[0.08] mb-12" />

    <!-- Enquiry form -->
    <section>
      <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-6">Send an Enquiry</h2>

      <div v-if="submitted" class="border border-primary/30 bg-primary/5 px-6 py-8 text-center max-w-lg">
        <svg class="w-8 h-8 text-primary mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        <p class="text-[15px] font-bold text-gray-900 dark:text-white mb-1">Enquiry received!</p>
        <p class="text-[13px] text-gray-500 dark:text-gray-400">We'll send you a media kit and pricing within 24 hours.</p>
      </div>

      <form v-else @submit.prevent="submit" class="flex flex-col gap-4 max-w-lg">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">Name <span class="text-red-500">*</span></label>
            <input v-model="form.name" type="text" required placeholder="Your name"
              class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                     text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">Company</label>
            <input v-model="form.company" type="text" placeholder="Company name"
              class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                     text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary transition-colors" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">Email <span class="text-red-500">*</span></label>
          <input v-model="form.email" type="email" required placeholder="your@email.com"
            class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                   text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary transition-colors" />
        </div>

        <div>
          <label class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">Monthly Budget</label>
          <select v-model="form.budget"
            class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                   text-gray-900 dark:text-white outline-none focus:border-primary transition-colors">
            <option value="">Select a range</option>
            <option>Under $500</option>
            <option>$500 – $1,000</option>
            <option>$1,000 – $3,000</option>
            <option>$3,000+</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">Tell us about your product</label>
          <textarea v-model="form.message" rows="4" placeholder="What are you promoting and who is your target audience?"
            class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                   text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary transition-colors resize-y" />
        </div>

        <div>
          <button type="submit" :disabled="submitting"
            class="bg-primary text-white px-6 py-2.5 text-[11px] font-black uppercase tracking-[2px]
                   hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="submitting">Sending…</span>
            <span v-else>Request Media Kit</span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
