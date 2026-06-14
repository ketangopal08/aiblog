<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <SeoHead :seo="{
      title: 'Privacy Policy – NeuralBriefly',
      description: 'Learn how NeuralBriefly collects, uses, and protects your personal data.',
      canonicalUrl: 'https://www.neuralbriefly.com/privacy',
      ogType: 'website',
    }" />

    <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]" />

    <div class="mb-10">
      <h1 class="text-[2rem] sm:text-[2.6rem] font-bold text-gray-900 dark:text-white leading-tight mb-3">
        Privacy Policy
      </h1>
      <p class="text-[13px] text-gray-400 dark:text-gray-500">Last updated: June 2025</p>
    </div>

    <div class="space-y-8 text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">1. Who We Are</h2>
        <p>NeuralBriefly ("we", "us", "our") is an independent AI news publication. This Privacy Policy explains how we collect and use information when you visit <strong class="text-gray-900 dark:text-white">neuralbriefly.com</strong>.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">2. Information We Collect</h2>
        <p class="mb-3">We collect the following types of data:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong class="text-gray-800 dark:text-gray-200">Usage data</strong> — pages visited, time on site, referrer URL, browser type, and device type, collected automatically via Google Analytics.</li>
          <li><strong class="text-gray-800 dark:text-gray-200">Contact form data</strong> — name, email, and message when you submit a contact or advertising enquiry form.</li>
          <li><strong class="text-gray-800 dark:text-gray-200">Cookies</strong> — see our <NuxtLink to="/cookie-policy" class="text-primary hover:underline">Cookie Policy</NuxtLink> for details.</li>
        </ul>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">3. How We Use Your Information</h2>
        <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>To understand how visitors use the Site and improve our content</li>
          <li>To respond to enquiries submitted via contact or advertising forms</li>
          <li>To monitor Site performance and fix technical issues</li>
        </ul>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">4. Google Analytics</h2>
        <p>We use Google Analytics to collect anonymised usage statistics. Google Analytics places cookies on your device and sends data to Google servers. You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a>.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">5. Data Sharing</h2>
        <p>We do not sell, trade, or rent your personal information. We may share anonymised, aggregated data with analytics providers (Google Analytics). We do not share personal contact form data with third parties.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">6. Data Retention</h2>
        <p>Contact form submissions are retained only as long as necessary to respond to your enquiry. Analytics data is retained per Google Analytics default settings (26 months).</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">7. Your Rights</h2>
        <p>You have the right to request access to, correction of, or deletion of any personal data we hold about you. To exercise these rights, contact us at <a href="mailto:editorial@neuralbriefly.com" class="text-primary hover:underline">editorial@neuralbriefly.com</a>.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the Site constitutes acceptance of the updated policy.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">9. Contact</h2>
        <p>Privacy-related questions can be directed to <a href="mailto:editorial@neuralbriefly.com" class="text-primary hover:underline">editorial@neuralbriefly.com</a>.</p>
      </section>

    </div>
  </div>
</template>
