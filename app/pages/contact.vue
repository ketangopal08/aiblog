<script setup lang="ts">
const { $config } = useNuxtApp()
const form = reactive({ name: '', email: '', subject: '', message: '' })
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')
const snackbar = ref(false)

async function submit() {
  submitting.value = true
  submitError.value = ''
  try {
    const body = new FormData()
    body.append('your-name', form.name)
    body.append('your-email', form.email)
    body.append('your-subject', form.subject)
    body.append('your-message', form.message)

    const res: any = await $fetch(
      `${$config.public.wpBaseUrl}/wp-json/neuralbriefly/v1/contact`,
      { method: 'POST', body }
    )

    if (res.status === 'mail_sent') {
      submitted.value = true
      snackbar.value = true
      setTimeout(() => { snackbar.value = false }, 4000)
    } else {
      submitError.value = res.message || 'Something went wrong. Please try again.'
    }
  } catch {
    submitError.value = 'Failed to send. Please check your connection and try again.'
  } finally {
    submitting.value = false
  }
}

const contactInfo = [
  {
    label: 'Editorial',
    value: 'editorial@neuralbriefly.com',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    label: 'Partnerships',
    value: 'partners@neuralbriefly.com',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',
  },
  {
    label: 'Response time',
    value: '1–2 business days',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <SeoHead :seo="{
      title: 'Contact Us – NeuralBriefly',
      description: 'Get in touch with the NeuralBriefly team for editorial, partnership, or general enquiries.',
      ogType: 'website',
      canonicalUrl: 'https://www.neuralbriefly.com/contact',
      ogImage: 'https://www.neuralbriefly.com/icon.png',
    }" />

    <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]" />

    <div class="mb-10">
      <h1 class="text-[2rem] sm:text-[2.6rem] font-bold text-gray-900 dark:text-white leading-tight mb-3">
        Get in Touch
      </h1>
      <p class="text-[16px] text-gray-500 dark:text-gray-400 leading-relaxed">
        Have a story tip, editorial question, or partnership idea? We'd love to hear from you.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-10">
      <!-- Contact info -->
      <div class="sm:col-span-1 flex flex-col gap-6">
        <div v-for="item in contactInfo" :key="item.label">
          <div class="text-primary mb-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
            </svg>
          </div>
          <p class="text-[11px] font-bold uppercase tracking-[2px] text-gray-400 dark:text-gray-500 mb-0.5">{{ item.label }}</p>
          <p class="text-[14px] text-gray-700 dark:text-gray-300">{{ item.value }}</p>
        </div>
      </div>

      <!-- Form -->
      <div class="sm:col-span-2">
        <form @submit.prevent="submit" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">
                Name <span class="text-red-500">*</span>
              </label>
              <input v-model="form.name" type="text" required placeholder="Your name"
                class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                       text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
                       rounded-full outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">
                Email <span class="text-red-500">*</span>
              </label>
              <input v-model="form.email" type="email" required placeholder="your@email.com"
                class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                       text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
                       rounded-full outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">
              Subject <span class="text-red-500">*</span>
            </label>
            <input v-model="form.subject" type="text" required placeholder="What's this about?"
              class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                     text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
                     outline-none focus:border-primary transition-colors" />
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">
              Message <span class="text-red-500">*</span>
            </label>
            <textarea v-model="form.message" required rows="6" placeholder="Your message…"
              class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                     text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
                     rounded-full outline-none focus:border-primary transition-colors resize-y" />
          </div>

          <div class="flex flex-col gap-3">
            <button type="submit" :disabled="submitting"
              class="rounded-full bg-primary text-white px-6 py-2.5 text-[11px] font-black uppercase tracking-[2px]
                     hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="submitting">Sending…</span>
              <span v-else>Send Message</span>
            </button>
            <p v-if="submitError" class="text-[13px] text-red-500">{{ submitError }}</p>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Snackbar -->
  <Teleport to="body">
    <Transition name="snack">
      <div
        v-if="snackbar"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
               flex items-center gap-3
               bg-[#1a1a1a] dark:bg-white text-white dark:text-gray-900
               px-5 py-3.5 rounded-xl shadow-2xl"
        style="min-width: 280px"
      >
        <span class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </span>
        <div>
          <p class="text-[13px] font-semibold leading-none mb-0.5">Message sent successfully!</p>
          <p class="text-[11px] opacity-60">We'll get back to you within 1–2 business days.</p>
        </div>
        <button @click="snackbar = false" class="ml-auto opacity-50 hover:opacity-100 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.snack-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.snack-leave-active { transition: all 0.2s ease-in; }
.snack-enter-from  { opacity: 0; transform: translate(-50%, 20px); }
.snack-leave-to    { opacity: 0; transform: translate(-50%, 20px); }
</style>
