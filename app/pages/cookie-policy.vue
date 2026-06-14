<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <SeoHead :seo="{
      title: 'Cookie Policy – NeuralBriefly',
      description: 'Learn how NeuralBriefly uses cookies and how you can control them.',
      canonicalUrl: 'https://www.neuralbriefly.com/cookie-policy',
      ogType: 'website',
    }" />

    <AppBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Cookie Policy' }]" />

    <div class="mb-10">
      <h1 class="text-[2rem] sm:text-[2.6rem] font-bold text-gray-900 dark:text-white leading-tight mb-3">
        Cookie Policy
      </h1>
      <p class="text-[13px] text-gray-400 dark:text-gray-500">Last updated: June 2025</p>
    </div>

    <div class="space-y-8 text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">1. What Are Cookies?</h2>
        <p>Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to site owners.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">2. Cookies We Use</h2>
        <div class="space-y-5">
          <div class="border border-gray-100 dark:border-white/[0.06] p-5">
            <p class="text-[12px] font-black uppercase tracking-[2px] text-primary mb-2">Essential Cookies</p>
            <p class="text-[14px] text-gray-600 dark:text-gray-400">These cookies are necessary for the Site to function. They include theme preference (light/dark mode). You cannot opt out of these cookies.</p>
          </div>
          <div class="border border-gray-100 dark:border-white/[0.06] p-5">
            <p class="text-[12px] font-black uppercase tracking-[2px] text-primary mb-2">Analytics Cookies</p>
            <p class="text-[14px] text-gray-600 dark:text-gray-400">We use <strong class="text-gray-800 dark:text-gray-200">Google Analytics</strong> (cookies: <code class="text-[13px] bg-gray-100 dark:bg-white/[0.06] px-1.5 py-0.5 rounded">_ga</code>, <code class="text-[13px] bg-gray-100 dark:bg-white/[0.06] px-1.5 py-0.5 rounded">_ga_*</code>) to understand how visitors interact with the Site. Data collected is anonymised and aggregated. These cookies persist for up to 2 years.</p>
          </div>
        </div>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">3. How to Control Cookies</h2>
        <p class="mb-3">You can control and delete cookies through your browser settings. Common browser guides:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Apple Safari</a></li>
          <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Microsoft Edge</a></li>
        </ul>
        <p class="mt-3">You can also opt out of Google Analytics tracking using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a>.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">4. Changes to This Policy</h2>
        <p>We may update this Cookie Policy as we add new features or services. Changes will be reflected on this page with an updated date.</p>
      </section>

      <hr class="border-gray-100 dark:border-white/[0.06]" />

      <section>
        <h2 class="text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500 mb-3">5. Contact</h2>
        <p>Questions about our cookie use? Contact us at <a href="mailto:editorial@neuralbriefly.com" class="text-primary hover:underline">editorial@neuralbriefly.com</a>.</p>
      </section>

    </div>
  </div>
</template>
