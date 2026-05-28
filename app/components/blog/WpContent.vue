<script setup lang="ts">
import DOMPurify from 'dompurify'

const props = defineProps<{ content: string }>()

const cleanHtml = computed(() =>
  import.meta.client ? DOMPurify.sanitize(props.content) : props.content
)
</script>

<template>
  <ClientOnly>
    <article class="prose prose-lg dark:prose-invert max-w-none" v-html="cleanHtml" />
  </ClientOnly>
</template>
