<template>
<div>
  <h2>Basic Contrast</h2>
  <div
    class="preview-list"
    :style="{'grid-template-columns': '1fr '.repeat(previewListColumns.length) }"
  >
    <div
      class="preview-cell"
      :style="{ background: namedColors.background.hex(), color: namedColors.c0.hex()}"
      v-for="([s], i) in previewListColumns"
      v-bind:key="i"
    >
      {{s}}
    </div>
    <div
      class="preview-cell"
      :style="{ background: bg.hex(), color: fg.hex()}"
      v-for="({bg,fg}, i) in previewList"
      v-bind:key="i"
    >
      {{previewNumber(bg,fg).toFixed(3)}}
    </div>
  </div>
  <h2>ANSI Colors</h2>
  <div
    class="ansi-list"
  >
    <div
      class="ansi-cell"
      :style="{ background: c.hex()}"
      v-for="(c, i) in ansiList"
      v-bind:key="i"
    >
    {{ansiLabel[i]}}
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
import yaml from 'js-yaml';
import Color from 'color';
import _ from 'lodash';
import Mustache from 'mustache';
import { c } from 'naive-ui';
// import Ansi from './Ansi.vue';

// import tmp from '..assets'
// import {getNamedColors} from '../colors';
import { getNamedColors } from '../base9';
import { render } from '../template';
// @ts-ignore
import semanticRaw from '../assets/semantic.yaml';
import terminalrcRaw from '../assets/templates/terminalrc.mustache?raw';
import base24Raw from '../assets/templates/base24.mustache?raw';
import { getCssVariableName, ColorPalette } from '../helpers';

const N = 9;

const contrastIndex = [1, 0, 0, 0, 0, 0, 0, 0, 0];
const previewListRows = '01234567';
const previewListColumns: [string, ((c: string) => string), ((c: string) => string)][] = [
  // ["cx_b", c => `c${c}_b`, c => `foreground`],
  // ["cx_m", c => `c${c}_m`, c => `foreground`],
  // ["cx_s", c => `c${c}_s`, c => `background`],
  // ["cx", c => `c${c}`, c => `c${c}_b`],
  // ["cx_h", c => `c${c}_h`, c => `c${c}_b`],
  ['Colored Bg', (c) => `c${c}_b`, (c) => 'foreground'],
  ['Colored Highlight', (c) => `c${c}_m`, (c) => 'foreground'],
  ['Softer', (c) => 'background', (c) => `c${c}_s`],
  ['Normal', (c) => 'background', (c) => `c${c}`],
  ['Harder', (c) => 'background', (c) => `c${c}_h`],
];

function getVar(i: number) {
  return `var(${getCssVariableName(i)})`;
}

const cellStyles = _.times(N, (i) => ({
  'background-color': getVar(i),
  color: getVar(contrastIndex[i]),
}));
const colors = inject('colors') as Ref<ColorPalette>;
const namedColors = computed(() => getNamedColors(colors.value, semanticRaw));
const previewList = computed(() => _.flatMap(
  previewListRows.split(''),
  (c) => _.map(
    previewListColumns,
    ([s, bg, fg]) => {
      if (c === ' ') {
        return {
          bg: namedColors.value.background,
          fg: namedColors.value.foreground,
        };
      }
      const cbg = namedColors.value[bg(c)];
      const cfg = namedColors.value[fg(c)];
      return {
        bg: cbg,
        fg: cfg,
      };
    },
  ),
));
function previewNumber(bg: Color, fg: Color) { return fg.contrast(bg); }
const ansiList = computed(() => _.times(16, (x) => namedColors.value[`ansi_${x.toString(16)}`]));
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
]

</script>
