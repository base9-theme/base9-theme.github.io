<template>
<div>
<n-select v-model:value="value" :options="options" />
<!-- <n-code :code="content" language="cpp">
</n-code> -->
<div class="content" style="">
{{content}}
</div>
</div>
</template>
<style>
.content {
  white-space: pre-wrap;
  font-family: monospace;
}
</style>

<script setup lang="ts">
import _, { Dictionary } from 'lodash';
import { computed, ref } from 'vue';

const templateRaw = import.meta.globEager('../assets/templates/*.mustache');
const templateObj: Dictionary<string> = Object.fromEntries(_.entries(templateRaw).map(([k, v]) => ([
  ((/\.\.\/assets\/templates\/(.*)\.mustache/.exec(k) || [])[1]),
  v.default,
])));

const value = ref(null);
const content = computed(() => value.value && templateObj[value.value]);
const options = _.map(templateObj, (v, k) => ({
  label: k,
  value: k,
}));
</script>

