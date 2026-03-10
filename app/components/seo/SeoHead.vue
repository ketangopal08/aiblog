<script setup lang="ts">
import type { ISeo } from '~/interfaces/ISeo'

const props = defineProps<{ seo: ISeo }>()
const url = useRequestURL()

useHead(computed(() => {
  const image = props.seo.ogImage || null

  const meta: Record<string, string>[] = [
    { name: 'description',          content: props.seo.description },
    { property: 'og:type',          content: 'article' },
    { property: 'og:url',           content: url.href },
    { property: 'og:title',         content: props.seo.title },
    { property: 'og:description',   content: props.seo.description },
    { property: 'og:site_name',     content: 'theintelliprompt' },
    { name: 'twitter:card',         content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title',        content: props.seo.title },
    { name: 'twitter:description',  content: props.seo.description },
  ]

  if (image) {
    meta.push(
      { property: 'og:image',        content: image },
      { property: 'og:image:width',  content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:image',       content: image },
    )
  }

  return { title: props.seo.title, meta }
}))
</script>

<template><slot /></template>
