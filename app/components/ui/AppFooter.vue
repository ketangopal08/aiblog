<template>
  <footer class="bg-gray-100 dark:bg-[#111111] border-t border-gray-200 dark:border-[#222222] transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="text-center mb-6">
        <div class="text-3xl font-black text-[#ff5811] tracking-tight uppercase">AI Blog</div>
        <div class="text-xs text-gray-400 tracking-widest uppercase mt-1">CLEAN | CREATIVE | PRACTICAL | SIMPLE TO SETUP</div>
      </div>
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-300 dark:border-[#222222] pt-5">
        <p class="text-xs text-gray-500 dark:text-gray-600 uppercase tracking-widest">&copy; {{ new Date().getFullYear() }} AIBlog. All rights reserved.</p>
        <div class="flex gap-6 text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest">
          <NuxtLink to="/" class="hover:text-[#ff5811] transition">Home</NuxtLink>
          <NuxtLink to="/about" class="hover:text-[#ff5811] transition">About</NuxtLink>
          <a href="#" class="hover:text-[#ff5811] transition">Contact</a>
          <a href="#" class="hover:text-[#ff5811] transition">Privacy</a>
        </div>
      </div>
    </div>
  </footer>
</template>
