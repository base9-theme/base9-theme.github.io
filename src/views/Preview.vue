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
          background: namedColors.background.o.color.hex(),
          color: namedColors.c0.o.color.hex(),
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
import { getNamedColors, render, NamedColors } from 'base9-core';

// @ts-ignore
import terminalrcRaw from '../assets/templates/terminalrc.mustache?raw';
import base24Raw from '../assets/templates/base24.mustache?raw';
import { getCssVariableName } from '../helpers';
import type { ColorPalette } from '../helpers';

const N = 9;

const contrastIndex = [1, 0, 0, 0, 0, 0, 0, 0, 0];
const previewListRows = '01234567';
const previewListColumns: [
  string,
  (c: string) => [string, string],
  (c: string) => [string, string],
][] = [
  ['Colored Bg', (c) => [`c${c}`, 'b'], () => ['foreground', 'o']],
  ['Colored Highlight', (c) => [`c${c}`, 'm'], () => ['foreground', 'o']],
  ['Softer', () => ['background', 'o'], (c) => [`c${c}`, 's']],
  ['Normal', () => ['background', 'o'], (c) => [`c${c}`, 'o']],
  ['Harder', () => ['background', 'o'], (c) => [`c${c}`, 'h']],
];

// function getVar(i: number) {
//   return `var(${getCssVariableName(i)})`;
// }

// const cellStyles = _.times(N, (i) => ({
//   'background-color': getVar(i),
//   color: getVar(contrastIndex[i]),
// }));
const colors = inject('colors') as Ref<ColorPalette>;
const namedColors = computed(() => getNamedColors(colors.value));
const previewList = computed(() => _.flatMap(previewListRows.split(''), (c) => _.map(previewListColumns, ([s, bg, fg]) => {
  if (c === ' ') {
    return {
      bg: namedColors.value.background,
      fg: namedColors.value.foreground,
    };
  }
  const cbg = (namedColors.value as any)[bg(c)[0]][bg(c)[1]].color;
  const cfg = (namedColors.value as any)[fg(c)[0]][fg(c)[1]].color;
  return {
    bg: cbg,
    fg: cfg,
  };
})));
function previewNumber(bg: Color, fg: Color) {
  return fg.contrast(bg);
}
const ansiList = computed(() => _.times(16, (x) => (namedColors.value.ansi as any)[x.toString(16)].color));
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
