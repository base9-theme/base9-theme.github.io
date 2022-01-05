<template>
<n-select
  :value="value"
  @update:value="updateValue"
  placeholder="Import from Base16"
  :render-label="renderLabel"
  filterable
  :options="options"/>
</template>
<script setup lang="ts">
import {
  h,
  inject, Ref, ref, watch,
} from 'vue';
import _ from 'lodash';
import { NIcon, useMessage } from 'naive-ui';
import Color from 'color';
import Logo from './Logo.vue';
import {
  ColorPalette, getColorsFromBase16, getColors16FromSchemeObj, toColorsString, renderWithSemantic,
} from '../helpers';

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
const renderLabel = function (option: typeof options[number]) {
  return [
    h(
      NIcon,
      {
        style: {
          verticalAlign: 'middle',
          marginRight: '4px',
        },
      },
      {
        default: () => h(Logo, {
          colors: option.data.colors,
        }),
      },
    ),
    option.label,
  ];
};
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
