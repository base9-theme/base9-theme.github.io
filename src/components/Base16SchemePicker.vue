<template>
<n-select
  :value="value"
  @update:value="updateValue"
  placeholder="Custom"
  :options="options"/>
</template>
<script setup lang="ts">
import {
  inject, Ref, ref, watch,
} from 'vue';
import _ from 'lodash';
import { useMessage } from 'naive-ui';
import Color from 'color';
import a from 'naive-ui/lib/typography/src/a';
import { ColorPalette, getColorsFromBase16, getColors16FromSchemeObj, toColorsString } from '../helpers';

const message = useMessage();

type Base16Scheme = {
  name: string,
  colors16: Color[],
  colors: ColorPalette,
}

const schemesRaw = import.meta.globEager('../assets/schemes-base16/*.yaml');
const options = _.entries(schemesRaw).map(([k, v], i) => {
  const key = ((/\.\.\/assets\/schemes-base16\/(.*)\.yaml/.exec(k) || [])[1]);
  const colors16 = getColors16FromSchemeObj(v);
  return {
    label: key,
    value: i,
    data: {
      name: key,
      colors16,
      colors: getColorsFromBase16(colors16),
    },
  };
});
const value = ref<null|number>(null);
const colors = inject('colors') as Ref<ColorPalette>;

watch(colors, (newColors: ColorPalette) => {
  const valueRaw = value.value;
  if (valueRaw !== null
  && toColorsString(newColors) !== toColorsString(options[valueRaw].data.colors)) {
    value.value = null;
  }
});

function updateValue(newValue: number|null) {
  value.value = newValue;
  if (newValue !== null) {
    const option = options[newValue];
    colors.value = option.data.colors.slice() as ColorPalette;
    message.success(`Imported: ${option.label}`);
  }
}
</script>
