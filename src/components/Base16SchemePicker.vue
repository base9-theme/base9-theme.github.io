<script setup lang="ts">
import { defineEmits } from 'vue';
import _ from 'lodash';
import { ColorPalette, getColorsFromBase16, getColorsFromSchemeObj } from '../helpers';
import Color from 'color';

const base24Digits = [
  'base00',
  'base01',
  'base02',
  'base03',
  'base04',
  'base05',
  'base06',
  'base07',
  'base08',
  'base09',
  'base0A',
  'base0B',
  'base0C',
  'base0D',
  'base0E',
  'base0F',
];

function getOptionFromSchemeObj(schemeObj: Dictionary<string>, i: number) {
  const colors16 = _.map(base24Digits, (v,k) => {
    const colorStr = schemeObj[v];
    if (colorStr[0] === '#') {
      return Color(colorStr);
    }
    return Color(`#${colorStr}`);
  })
  return {
    label: schemeObj.theme,
    colors16: colors16,
    colors: [
      colors16[0],
      colors16[5],
      colors16[8],
      colors16[9],
      colors16[10],
      colors16[11],
      colors16[12],
      colors16[13],
      colors16[14],
    ]
  }
}
type Base16Scheme = {
  name: string,
  colors16: Color[],
  colors: ColorPalette,
}

const schemesRaw = import.meta.globEager('../assets/schemes-base16/*.yaml');
const options = _.entries(schemesRaw).map(([k, v]) => {
  const key = ((/\.\.\/assets\/schemes-base16\/(.*)\.yaml/.exec(k) || [])[1]);
  const colors16 = getColorsFromSchemeObj(v);
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
}
</script>
<template>
<n-dropdown @select="handleSelect" trigger="click" :options="options">
  <n-button type="primary">Import Base16</n-button>
</n-dropdown>
</template>
