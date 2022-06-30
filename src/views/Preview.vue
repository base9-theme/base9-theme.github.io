<template>
  <div>
    <h2>Basic Contrast</h2>
    <div
      class="preview-list"
      :style="{
        'grid-template-columns': '1fr '.repeat(previewListColumns.length),
      }"
    >
      <div
        class="preview-cell"
        :style="{
          background: (colorData as any).background.hex(),
          color: (colorData as any).c0.p100.hex(),
        }"
        v-for="([s], i) in previewListColumns"
        v-bind:key="i"
      >
        {{ s }}
      </div>
      <div
        class="preview-cell"
        :style="{ background: bg.hex(), color: fg.hex() }"
        v-for="({ bg, fg }, i) in previewList"
        v-bind:key="i"
      >
        {{ previewNumber(bg, fg).toFixed(3) }}
      </div>
    </div>
    <h2>ANSI Colors</h2>
    <div class="ansi-list">
      <div
        class="ansi-cell"
        :style="{ background: c.hex() }"
        v-for="(c, i) in ansiList"
        v-bind:key="i"
      >
        {{ ansiLabel[i] }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.preview-list {
  display: grid;
  column-gap: 2px;
  background: var(--base9-0);
}
.preview-cell {
  height: 20px;
  text-align: center;
}
.ansi-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.ansi-cell {
  height: 20px;
  text-align: center;
}
</style>
<script setup lang="ts">
import {
  computed, defineComponent, inject, Ref, ref,
} from 'vue';
import Color from 'color';
import _ from 'lodash';
// import Ansi from './Ansi.vue';

// import tmp from '..assets'
import { getColorData } from 'base9-core';

import type { ColorPalette } from 'base9-core';

const previewListRows = '01234567';
const previewListColumns: [
  string,
  (c: string) => [string, string],
  (c: string) => [string, string],
][] = [
  ['p10 bg', (c) => [`c${c}`, 'p10'], () => ['foreground', 'p100']],
  ['p25 bg', (c) => [`c${c}`, 'p25'], () => ['foreground', 'p100']],
  ['p50 bg', (c) => [`c${c}`, 'p50'], () => ['foreground', 'p100']],
  ['p75', () => ['ansi', '0'], (c) => [`c${c}`, 'p75']],
  ['p100', () => ['ansi', '0'], (c) => [`c${c}`, 'p100']],
  ['p125', () => ['ansi', '0'], (c) => [`c${c}`, 'p125']],
];

// function getVar(i: number) {
//   return `var(${getCssVariableName(i)})`;
// }

// const cellStyles = _.times(N, (i) => ({
//   'background-color': getVar(i),
//   color: getVar(contrastIndex[i]),
// }));
const colors = inject('colors') as Ref<ColorPalette>;
const colorData = computed(() => getColorData(colors.value));
// const namedColors = computed(() => {
//   const tmp = getColorData(colors.value);
//   (window as any).namedColors = tmp;
//   return tmp;
// });
const previewList = computed(() => _.flatMap(previewListRows.split(''), (c) => _.map(previewListColumns, ([s, bg, fg]) => {
  if (c === ' ') {
    return {
      bg: colorData.value.background,
      fg: colorData.value.foreground,
    };
  }
  const cbg = (colorData.value as any)[bg(c)[0]][bg(c)[1]];
  const cfg = (colorData.value as any)[fg(c)[0]][fg(c)[1]];
  return {
    bg: cbg,
    fg: cfg,
  };
})));
function previewNumber(bg: Color, fg: Color) {
  return fg.contrast(bg);
}

const ansiList = computed(() => _.times(
  16,
  (x) => (colorData.value.ansi as any)[x.toString(16)],
));
const ansiLabel = [
  'Black',
  'Red',
  'Green',
  'Yellow',
  'Blue',
  'Magenta',
  'Cyan',
  'White',
  'Bright Black',
  'Bright Red',
  'Bright Green',
  'Bright Yellow',
  'Bright Blue',
  'Bright Magenta',
  'Bright Cyan',
  'Bright White',
];
</script>
