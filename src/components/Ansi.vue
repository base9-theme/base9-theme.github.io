<script lang="ts">
import { defineComponent, ref, VueElement, PropType } from 'vue'

// import tmp from '..assets'
import yaml from 'js-yaml'
import Color from 'color'
import _ from 'lodash'
// import {getNamedColors} from '../colors';
import {getNamedColors} from '../base9';
import {render} from '../template';
import semanticRaw from '../assets/semantic.yaml?raw';

export default defineComponent({
  props: {
      colors: Array as PropType<Array<Color>>
  },
});
</script>
<template>
<div class="ansi-list">
    <div
        class="ansi-cell"
        :style="{ background: c.hex(), color: 'white'}"
        v-for="(c, i) in colors"
        v-bind:key="i"
    >
        {{c.hex()}}
    </div>
</div>
</template>
<style scoped>
.ansi-list {
  display: grid;
  /* column-gap: 2px;
  background: var(--base12-0); */
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
</style>
