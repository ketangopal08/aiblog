<script setup lang="ts">
import DOMPurify from 'dompurify'

const props = defineProps<{ content: string }>()

const cleanHtml = computed(() =>
  import.meta.client ? DOMPurify.sanitize(props.content) : props.content
)
</script>

<template>
  <article class="wp-article prose dark:prose-invert max-w-none" v-html="cleanHtml" />
</template>

<style scoped>
.wp-article { font-size: 1.1rem; }
@media (min-width: 1024px) {
  .wp-article { font-size: 1.125rem; }
}
</style>
