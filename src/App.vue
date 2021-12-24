<template>
<n-theme-editor>
  <n-message-provider>
    <n-layout>
      <n-layout-header bordered style="display: flex; height: 64px; align-items: center;">
        <span style="font-size: 32px">Base9</span>
      </n-layout-header>
    </n-layout>
    <base-16-scheme-picker @update="tmp" style="float: right;"/>
    <import v-model:colors="colors" style="float: left;"/>
  </n-message-provider>
</n-theme-editor>
</template>
<style>
</style>
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from 'vue';
// import Main from './components/Main.vue'
import Main from './components/Main2.vue';
import Base16SchemePicker, {Base16Scheme} from './components/Base16SchemePicker.vue';
import Import from './components/Import.vue';
import Color from 'color'
import _ from 'lodash'

const defaultColorsInput = '282936-e9e9f4-ffffff-ff5555-ffb86c-f1fa8c-50fa7b-8be9fd-bd93f9-ff79c6';
const colors = ref(_.map(defaultColorsInput.split('-'), (s) => Color(`#${s}`)));
function tmp(x: Base16Scheme) { colors.value = x.colors; }
</script>
