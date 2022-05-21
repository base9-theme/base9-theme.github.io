<template>
<n-icon :size="size" v-html="content"/>
</template>
<style>

</style>
<script setup lang="ts">
import { defineProps } from 'vue';
import { render } from '../base9-core/index';
import type { ColorPalette } from '../base9-core/index';
import logoTemplate from '../assets/templates/logo.svg.mustache';

const props = defineProps<{
    colors: ColorPalette,
    size?: number|string,
}>();
const content = render(logoTemplate, props.colors);
</script>
