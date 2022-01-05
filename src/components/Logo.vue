<template>
<n-icon :size="size" v-html="content"/>
</template>
<style>

</style>
<script setup lang="ts">
import { ColorPalette, renderWithSemantic } from '../helpers';
import logoTemplate from '../assets/templates/logo.svg.mustache';

const props = defineProps<{
    colors: ColorPalette,
    size: number|string|undefined,
}>();
const content = renderWithSemantic(logoTemplate, props.colors);
</script>
