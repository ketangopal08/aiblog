<script setup lang="ts">
import type { ISeo } from '~/interfaces/ISeo'

const props = defineProps<{ seo: ISeo }>()

useHead({
  title: props.seo.title,
  meta: [
    { name: 'description', content: props.seo.description },
    { property: 'og:title', content: props.seo.title },
    { property: 'og:description', content: props.seo.description },
    ...(props.seo.ogImage ? [{ property: 'og:image', content: props.seo.ogImage }] : [])
  ]
})
</script>

<template><slot /></template>
