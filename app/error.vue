<script setup lang="ts">
const error = useError()
const is404 = computed(() => error.value?.statusCode === 404)

const handleBack = () => clearError({ redirect: '/' })

useHead({
  meta: [{ name: 'robots', content: 'noindex, follow' }],
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-[#0D0D0D] transition-colors duration-300">
    <AppHeader />
    <main class="flex-1 flex items-center justify-center px-6">
      <div class="text-center max-w-md">
        <p class="text-[80px] font-black text-gray-900 dark:text-white leading-none mb-4 tracking-tighter">
          {{ error?.statusCode ?? 500 }}
        </p>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {{ is404 ? 'Page not found' : 'Something went wrong' }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {{ is404
            ? "The page you're looking for doesn't exist or has been moved."
            : 'An unexpected error occurred. Please try again.' }}
        </p>
        <button
          type="button"
          class="text-sm font-bold text-primary
                 bg-primary text-white px-6 py-3
                 hover:bg-primary/80 transition"
          @click="handleBack"
        >
          ← Back to homepage
        </button>
      </div>
    </main>
  </div>
</template>
