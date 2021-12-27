<template>
<n-theme-editor>
  <n-message-provider>
    <n-layout>
      <n-layout-header bordered style="display: flex; height: 64px; align-items: center;">
        <span style="font-size: 32px">Base9</span>
        <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
      </n-layout-header>
      <n-layout-content>
        <n-layout has-sider>
          <n-layout-sider
            collapse-mode="transform"
            :collapsed-width="0"
            :width="240"
            show-trigger="arrow-circle"
            content-style="padding: 24px;"
            bordered
          > <color-palette/>
            <base-16-scheme-picker/>
            <import/>
          </n-layout-sider>
          <n-layout-content>
            <router-view  v-bind:style="cssVariable"/>
          </n-layout-content>
        </n-layout>
      </n-layout-content>
    </n-layout>
    <div>
    <!-- <n-button-group vertical style="width: 100%">
    </n-button-group> -->
    </div>
  </n-message-provider>
</n-theme-editor>
</template>
<style>
</style>
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import {
  computed, h, provide, Ref, ref,
} from 'vue';
// import Main from './components/Main.vue'
import Color from 'color';
import _ from 'lodash';
import { RouterLink } from 'vue-router';
import Main from './components/Main2.vue';
import Base16SchemePicker from './components/Base16SchemePicker.vue';
import ColorPalette from './components/ColorPalette.vue';
import Import from './components/Import.vue';
import { getCssVariableName } from './helpers';

const defaultColorsInput = '282936-e9e9f4-ff5555-ffb86c-f1fa8c-50fa7b-8be9fd-bd93f9-ff79c6';
const colors = ref(_.map(defaultColorsInput.split('-'), (s) => Color(`#${s}`)));
const menuRaw = [
  {
    label: 'tmp1',
    path: '/',
  },
  {
    label: 'tmp2',
    path: '/export',
  },
];
const menuOptions = _.map(menuRaw, ({ label, path }) => ({
  label: () => h(
    RouterLink,
    {
      to: { path },
    },
    { default: () => label },
  ),
  key: label,
}));
const activeKey = ref(null);
provide('colors', colors);
const cssVariable = computed(() => Object.fromEntries(
  _.map(colors.value, (c, i) => [getCssVariableName(i), c.hex()]),
));

// window['Color'] = Color;
// window['colors'] = colors;
</script>
