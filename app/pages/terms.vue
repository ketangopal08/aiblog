<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <SeoHead :seo="{
      title: 'Terms of Service – NeuralBriefly',
      description: 'Read the Terms of Service for NeuralBriefly. By using our site you agree to these terms.',
      canonicalUrl: 'https://www.neuralbriefly.com/terms',
      ogType: 'website',
    }" />

    <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Terms of Service' }]" />

    <div class="mb-10">
      <h1 class="text-[2rem] sm:text-[2.6rem] font-bold text-gray-900 dark:text-white leading-tight mb-3">
        Terms of Service
      </h1>
      <p class="text-[13px] text-gray-400 dark:text-gray-500">Last updated: June 2025</p>
    </div>

    <div class="prose-content space-y-8 text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">1. Acceptance of Terms</h2>
        <p>By accessing or using NeuralBriefly ("the Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">2. Content</h2>
        <p>All articles, guides, and editorial content published on NeuralBriefly are for informational purposes only. We make no guarantees as to the accuracy, completeness, or timeliness of the content. The AI landscape changes rapidly — always verify important information from primary sources.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">3. Intellectual Property</h2>
        <p>All content on NeuralBriefly, including text, images, logos, and design, is owned by NeuralBriefly or its content providers and is protected by copyright law. You may not reproduce, distribute, or republish any content without prior written permission.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">4. Third-Party Links</h2>
        <p>The Site may contain links to third-party websites. These links are provided for convenience only. NeuralBriefly has no control over the content of those sites and accepts no responsibility for them.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">5. Disclaimer of Warranties</h2>
        <p>The Site is provided "as is" without warranties of any kind, either express or implied. NeuralBriefly does not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">6. Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, NeuralBriefly shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of, or inability to use, the Site or its content.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">7. Changes to These Terms</h2>
        <p>We reserve the right to update these Terms of Service at any time. Continued use of the Site after changes are posted constitutes your acceptance of the updated terms.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">8. Contact</h2>
        <p>For questions about these Terms, please contact us at <a href="mailto:editorial@neuralbriefly.com" class="text-primary hover:underline">editorial@neuralbriefly.com</a>.</p>
      </section>

    </div>
  </div>
</template>
