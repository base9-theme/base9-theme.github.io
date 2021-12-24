<template>
<n-form-item :validation-status="valid ? 'success' : 'error'" :show-label="false" :show-feedback="false">
  <n-input-group>
    <n-input :placeholder="placeholder" :value="input" @update:value="updateInput"/>
    <n-button @click="copy" #icon ><content-copy-sharp/></n-button>
  </n-input-group>
</n-form-item>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue';
import _ from 'lodash';
import { ContentCopySharp } from '@vicons/material';
import { useMessage } from 'naive-ui';
import Color from 'color';
import { ColorPalette } from '../helpers';
//.n-form-item .n-form-item-blank.n-form-item-blank--error .n-input:not(.n-input--disabled) .n-input__state-border

const message = useMessage();
const colorPaletteRegex = /([0-9a-fA-F]{6}-){8}[0-9a-fA-F]{6}/;
const placeholder = "111111-222222-333333-444444-555555-666666-777777-888888"

const props = defineProps<{ colors: ColorPalette }>();
const input = ref('');
const valid = computed(() => colorPaletteRegex.test(input.value));

watch(props, (propsNew) => {
  input.value = _.map(propsNew.colors, (c) => c.hex().toString().substring(1)).join('-');
});
const updateColor = defineEmits<{(e: 'update:colors', value: ColorPalette): void }>();

function copy() {
  navigator.clipboard.writeText(input.value);
  message.success('Copied');
}
function updateInput(newInput: string) {
  input.value = newInput;
  if(colorPaletteRegex.test(newInput)) {
    const colors = _.map(newInput.split('-'), s => Color(`#${s}`)) as ColorPalette;
    console.log(colors);
    updateColor('update:colors', colors);
  }
}
</script>
