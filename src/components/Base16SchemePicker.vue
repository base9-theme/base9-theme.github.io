<template>
<n-dropdown @select="handleSelect" trigger="click" :options="options">
  <n-button quaternary type="primary">Import Base16 Scheme</n-button>
</n-dropdown>
</template>
<script setup lang="ts">
import { defineEmits } from 'vue';
import _ from 'lodash';
import { ColorPalette, getColorsFromBase16, getColors16FromSchemeObj } from '../helpers';
import { useMessage } from 'naive-ui'
import Color from 'color';
const message = useMessage();

type Base16Scheme = {
  name: string,
  colors16: Color[],
  colors: ColorPalette,
}

const schemesRaw = import.meta.globEager('../assets/schemes-base16/*.yaml');
const options = _.entries(schemesRaw).map(([k, v]) => {
  const key = ((/\.\.\/assets\/schemes-base16\/(.*)\.yaml/.exec(k) || [])[1]);
  const colors16 = getColors16FromSchemeObj(v);
  return {
    label: key,
    key: {
      name: key,
      colors16,
      colors: getColorsFromBase16(colors16),
    }
  }
});
const a = defineEmits<{(e: 'update', value: Base16Scheme): void
}>();
function handleSelect(key: Base16Scheme) {
  a('update', key);
  message.success("Imported: " + key.name);
}
</script>