<template>
<n-icon :size="size" v-html="content"/>
</template>
<style>

</style>
<script setup lang="ts">
import { defineProps } from 'vue';
import { render } from '../helpers';
import type { ColorPalette } from '../helpers';
import logoTemplate from '../assets/templates/logo.svg.mustache';

const props = defineProps<{
    colors: ColorPalette,
    size?: number|string,
}>();
const content = render(logoTemplate, props.colors);
</script>
