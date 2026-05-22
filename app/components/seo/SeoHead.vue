<script setup lang="ts">
import type { ISeo } from '~/interfaces/ISeo'
const props = defineProps<{ seo: ISeo }>()
useSeo(props.seo)
</script>

<template><slot /></template>
