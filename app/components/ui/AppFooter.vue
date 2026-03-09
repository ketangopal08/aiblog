<template>
  <footer class="bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span class="text-xl font-black italic tracking-tighter text-gray-900 dark:text-white">
        AI<span class="text-teal-500">Blog</span>
      </span>
      <p class="text-sm text-gray-500 dark:text-gray-600">&copy; {{ new Date().getFullYear() }} AIBlog. All rights reserved.</p>
      <div class="flex gap-5 text-sm text-gray-500 dark:text-gray-500">
        <NuxtLink to="/" class="hover:text-teal-500 transition">Home</NuxtLink>
        <NuxtLink to="/about" class="hover:text-teal-500 transition">About</NuxtLink>
      </div>
    </div>
  </footer>
</template>
