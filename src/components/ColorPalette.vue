<template>
  <div>
    <n-color-picker
      v-for="(color, i) in colorsHexView"
      :show-alpha="false"
      v-bind:key="i"
      size="large"
      v-model:value="colorsHexView[i].value" />
  </div>
</template>
<script setup lang="ts">
import { inject, computed, Ref, toRef, triggerRef, watch } from 'vue';
import Color from 'color';
import _ from 'lodash';
import { ColorPalette } from '../helpers';

const colors = inject('colors') as Ref<ColorPalette>;
watch(colors, colorsNew => {
  console.log(colorsNew);
});
const colorsHexView = _.times(9, (i: number) => computed({
  get: () => colors.value[i].hex(),
  set: (s: string) => { colors.value[i] = Color(s); colors.value=colors.value.slice(); },
}));
</script>
