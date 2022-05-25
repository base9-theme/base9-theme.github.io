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
import {
  computed, inject, Ref, ref,
} from 'vue';
import { render } from 'base9-core';
import semantic from '../assets/semantic.yaml';
import type { ColorPalette } from 'base9-core';

const templateRaw = import.meta.globEager('../assets/templates/*.mustache');
const templateObj: Dictionary<string> = Object.fromEntries(_.entries(templateRaw).map(([k, v]) => ([
  ((/\.\.\/assets\/templates\/(.*)\.mustache/.exec(k) || [])[1]),
  v.default,
])));

const colors = inject('colors') as Ref<ColorPalette>;

const value = ref(null);
const content = computed(() => {
  if (!value.value) {
    return null;
  }
  const template = templateObj[value.value];
  return render(template, colors.value);
});

const options = _.map(templateObj, (v, k) => ({
  label: k,
  value: k,
}));
</script>
