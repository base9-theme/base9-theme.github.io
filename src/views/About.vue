<template>
<div v-html="content">
</div>
</template>
<style>

</style>
<script setup lang="ts">
import { marked } from 'marked';
import mdString from '../assets/about.md';

const content = marked(mdString, { sanitize: true });
</script>
