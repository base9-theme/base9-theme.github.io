<template>
<n-theme-editor>
  <n-config-provider :hljs="hljs">
  <n-message-provider>
    <n-layout>
      <n-layout-header bordered style="display: flex; height: 64px; align-items: center;">
        <logo :size="32" :colors="colors"/>
        <!-- <span style="width: 32px; height: 32px;" v-html="svgString"></span> -->
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
            <router-view  :key="$route.path" v-bind:style="cssVariable"/>
          </n-layout-content>
        </n-layout>
      </n-layout-content>
    </n-layout>
    <div>
    <!-- <n-button-group vertical style="width: 100%">
    </n-button-group> -->
    </div>
  </n-message-provider>
  </n-config-provider>
</n-theme-editor>
</template>
<style>
</style>
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import {
  computed, h, provide, Ref, ref, watch,
} from 'vue';
import hljs from 'highlight.js/lib/core';
import Color from 'color';
import _, { isArray } from 'lodash';
import {
  useRoute, useRouter, RouterLink,
} from 'vue-router';
import type { RouteLocation } from 'vue-router';

// import Main from './components/Main2.vue';
import Base16SchemePicker from './components/Base16SchemePicker.vue';
import Import from './components/Import.vue';
import Logo from './components/Logo.vue';
import { getCssVariableName } from './helpers';
import type { ColorPalette } from 'base9-core';
import { render, toPaletteString, PALETTE_REGEX } from 'base9-core';
import logoTemplate from './assets/templates/logo.svg.mustache';

const route = useRoute();
const router = useRouter();
const DEFAULT_PALETTE = '282936-e9e9f4-ff5555-ffb86c-f1fa8c-50fa7b-8be9fd-bd93f9-ff79c6';
function getDefaultPalette() {
  const palette = route.params.base9;
  if (typeof palette !== 'string' || !PALETTE_REGEX.test(palette)) {
    return DEFAULT_PALETTE;
  }
  return palette;
}

function hasBase9Param(r: RouteLocation) {
  return r.query.base9 !== undefined;
}

router.beforeEach((to, from, next) => {
  if (!hasBase9Param(to) && hasBase9Param(from)) {
    // TODO remove "!"
    next({ name: to.name!, query: from.query });
  } else {
    next();
  }
});

const colors = ref(_.map(getDefaultPalette().split('-'), (s) => Color(`#${s}`)) as ColorPalette);

watch(
  () => route.query.base9,
  (palette) => {
    if (typeof palette !== 'string') {
      return;
    }
    const newColors = _.map(palette.split('-'), (s) => Color(`#${s}`)) as ColorPalette;
    colors.value = newColors;
  },
);

watch(colors, async (colorsNew) => {
  const paletteString = toPaletteString(colorsNew);
  if (!paletteString) {
    return;
  }
  await router.replace({
    query: { base9: paletteString },
  });
});
const menuRaw = [
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Preview',
    path: '/',
  },
  {
    label: 'Export',
    path: '/export',
  },
];

const guideRaw = [
  {
    label: 'Template',
    path: 'template',
  },
]

function createRouterLinkMenuItem({path, label}: {path: string, label: string}) {
   return {
     label: () => h(
      RouterLink,
      {
        to: { path },
      },
      { default: () => label },
     ),
     key: label,
   }
}
const menuOptions = [
  ..._.map(menuRaw, createRouterLinkMenuItem),
  {
    label: 'Guide',
    key: 'Guide',
    children: [
      createRouterLinkMenuItem({path: '/guide/template', label: 'Template'}),
    ]
  }
];
const activeKey = ref(null);
provide('colors', colors);
const svgString = computed(() => render(logoTemplate, colors.value));
const cssVariable = computed(() => Object.fromEntries(
  _.map(colors.value, (c, i) => [getCssVariableName(i), c.hex()]),
));

// window['Color'] = Color;
// window['colors'] = colors;
// `<path fill="#0F0" d="M${a1} 0H${a0-a1}C${a0-a2} 0 ${a0} ${a2} ${a0} ${a1}V${a0-a1}C${a0} ${a0-a2} ${a0-a2} ${a0} ${a0-a1} ${a0}H${a1}C${a2} ${a0} 0 ${a0-a2} 0 ${a0-a1}V${a1}C0 ${a2} ${a2} 0 ${a1} 0 z" />`
</script>
