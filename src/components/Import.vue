<template>
<n-form-item :validation-status="valid ? 'success' : 'error'" :show-label="false" :show-feedback="false">
  <n-input-group>
    <n-input :placeholder="placeholder" :value="input" @update:value="updateInput"/>
    <n-button @click="copy" #icon ><content-copy-sharp/></n-button>
  </n-input-group>
</n-form-item>
</template>

<script setup lang="ts">
import {
  defineProps, ref, watch, computed, defineEmits, Ref, inject,
} from 'vue';
import _ from 'lodash';
import { ContentCopySharp } from '@vicons/material';
import { useMessage } from 'naive-ui';
import Color from 'color';
import { ColorPalette, toColorsString } from '../helpers';


const message = useMessage();
const colorPaletteRegex = /([0-9a-fA-F]{6}-){8}[0-9a-fA-F]{6}/;
const placeholder = '111111-222222-333333-444444-555555-666666-777777-888888-999999';

const colors = inject('colors') as Ref<ColorPalette>;
const input = ref(toColorsString(colors.value));
const valid = computed(() => colorPaletteRegex.test(input.value));

watch(colors, (colorsNew) => {
  input.value = toColorsString(colorsNew);
});

function copy() {
  navigator.clipboard.writeText(input.value);
  message.success('Copied');
}
function updateInput(newInput: string) {
  input.value = newInput;
  if (colorPaletteRegex.test(newInput)) {
    const colors2 = _.map(newInput.split('-'), (s) => Color(`#${s}`)) as ColorPalette;
    colors.value = colors2;
  }
}
</script>
