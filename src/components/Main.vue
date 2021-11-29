<script lang="ts">
import { ref } from 'vue'
import YAML from 'yaml'
import Color from 'color'
import _ from 'lodash'
const N = 16;


const testColors = [
  Color("#131313"),
  Color("#1f1f1f"),
  Color("#2a3141"),
  Color("#343d50"),
  Color("#d6dae4"),
  Color("#c1c8d7"),
  Color("#e3e6ed"),
  Color("#ffffff"),
  Color("#f71118"),
  Color("#ecb90f"),
  Color("#0f80d5"),
  Color("#2cc55d"),
  Color("#0f80d5"),
  Color("#2a84d2"),
  Color("#4e59b7"),
  Color("#7b080c"),
  Color("#0a0a0a"),
  Color("#020202"),
  Color("#de342e"),
  Color("#f2bd09"),
  Color("#1dd260"),
  Color("#289af0"),
  Color("#509bdc"),
  Color("#524fb9")
]

const base24Digits = [
  'base00',
  'base01',
  'base02',
  'base03',
  'base04',
  'base05',
  'base06',
  'base07',
  'base08',
  'base09',
  'base0A',
  'base0B',
  'base0C',
  'base0D',
  'base0E',
  'base0F',
  'base10',
  'base11',
  'base12',
  'base13',
  'base14',
  'base15',
  'base16',
  'base17',
]

const contrastIndex = [7,7,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

function getVar(i: number) {
  return `var(--base24-${i})`;
}

const cellStyles = _.times(24, i => ({
  "background-color": getVar(i),
  color: getVar(contrastIndex[i]),
}));

type Base24Colors = Color[];
type Base24Object = {
  scheme: string,
  author: string,
  [key: string]: string,
}

export default {
  data(vm) {
    const colors: Color[] = [];
    for(let i=0;i<24;i++) {
      colors[i] = Color("#000000")
    }

    return {
      yamlText: "",
      scheme: "Default",
      author: "Forrest Li",
      selected: 0,
      cellStyles,
      colors: testColors,
    }
  },
  created() {
    return {
      Color,
      cellStyles,
    };
  },
  computed: {
    cssVariable(): {[key: string]: string} {
      return Object.fromEntries(_.map(this.colors, (c,i) => [`--base24-${i}`, c.hex()]));
    }
  },
  props: {
    msg: String,
  },
  methods: {
    setColor(i: number, c: Color) {
      this.colors[i] = c;
      console.log(this.colors);
    },
    mixForground(r: number) {
      for(let i=0;i<8;i++) {
        this.colors[i+16]=this.colors[i+8].mix(this.colors[7], r);
      }
    },
    importYaml() {
      const obj = YAML.parse(this.yamlText);
      if(!_.isObjectLike(obj)) {
        return;
      }
      if(_.isString(obj.scheme)) {
        this.scheme=obj.scheme;
      }
      if(_.isString(obj.author)) {
        this.author = obj.scheme
      }
      for(let i=0;i<24;i++) {
        const value = obj[base24Digits[i]];
        if(!_.isString(value)) {
          continue;
        } else if(/[0-9a-fA-F]{6}/.test(value)) {
          this.colors[i] = Color("#"+value);
          // rtnEntries.push(Color("#"+value));
        } else if(/#[0-9a-fA-F]{6}/.test(value)) {
          this.colors[i] = Color(value);
        } else {
        }
      }
    },
    exportYaml() {
      const yaml = Object.fromEntries([
        ['scheme', this.scheme],
        ['author', this.author],
        ..._.times(24, i => [base24Digits[i], this.colors[i].hex()]),
      ])
      this.yamlText = YAML.stringify(yaml);
    },
    changeColorText(i: number, e: InputEvent) {
      try {
        this.colors[i] = Color(e.currentTarget?.value)
      } catch (e) {
        this.colors[i] = this.colors[i];
      }
    },
  }
}

</script>
<template>
<div v-bind:style="cssVariable">
  <h1>{{ scheme }}</h1>
  <div class="color-list" >
    <span
      class="color-cell"
      v-on:click="selected = i"
      :style="cellStyles[i]"
      v-for="(color, i) in colors"
      v-bind:key="i"
    >
      {{ color.hex().toString() }}
    </span>
  </div>
  <div class="color-list" >
    <input
      class="color-cell"
      v-on:click="selected = i"
      :style="cellStyles[i]"
      v-for="(color, i) in colors"
      v-bind:key="i"
      :value="color.hex().toString()"
      v-on:change="changeColorText(i, $event)"
    />
  </div>
  <span> selected: {{ selected }} </span>
  <button v-on:click="mixForground(0.3)">mix</button> 

  <button v-on:click="setColor(16, Color('#123456'))">test</button> 
  <button v-on:click="importYaml()">import</button> 
  <button v-on:click="exportYaml()">export</button> 
  <textarea v-model="yamlText" placeholder="add multiple lines"></textarea>
</div>
</template>

<style scoped>
.color-list {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}

.color-cell {
  border: 0;
  min-width: 0;
}

a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
