<template>
<div @keypress="handleKeyPress">
  <n-popover
    trigger="click"
    v-for="(color, i) in colors"
    v-bind:key="i"
    placement="right-start"
  >
    <template #trigger >
      <div
        className="slot"
        :style="{ backgroundColor: color.hex(), color: contrastColor(color)}"
      >{{color.hex()}}</div>
    </template>
    <ColorPicker v-model:color="colors[i]" :otherColors="getOtherColors(i)"/>
  </n-popover>
  <n-button
    type="primary"
    quaternary
    size="large"
    @click="generate"
    :style="{width: '100%', marginTop: '5px'}"
  >
    Generate<br>
    (Spacebar)
  </n-button>
  <import/>
  <base-16-scheme-picker/>
</div>
</template>
<style scoped>
.slot {
  height: 50px;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
}
</style>
<script setup lang="ts">
import {
  inject, computed, Ref,
} from 'vue';
import Color from 'color';
import _ from 'lodash';
import type { ColorPalette } from '../helpers';
import ColorPicker from './ColorPicker.vue';
import { renderString } from 'base9-builder';
import { useRouter } from 'vue-router';

const colors = inject('colors') as Ref<ColorPalette>;
function getOtherColors(i: number) {
  const rtn = colors.value.map(c => ({
    color: c,
    label: '',
  }));
  rtn.splice(i, 1);
  return rtn;
}
function contrastColor(c: Color) {
  if(c.l() < 50) {
    return '#ffffff';
  } else {
    return '#000000';
  }
}
const router = useRouter();

async function generate() {
  const palette = renderString("?", "{{PALETTE}}");
  // console.log(new Error().stack);
  await router.push({
    query: { palette: palette },
  });
}

function handleKeyPress(e: KeyboardEvent) {
  if(e.code === 'Space') {
    // generate();
  }
}
</script>
