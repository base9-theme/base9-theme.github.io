<script lang="ts">
import { defineComponent, ref, VueElement } from 'vue'

// import tmp from '..assets'
import yaml from 'js-yaml'
import Color from 'color'
import _ from 'lodash'

const N=24;

const schemesRaw = import.meta.globEager("../assets/schemes/*.yaml")
import terminalrcRaw from "../assets/templates/terminalrc.mustache?raw";
import base24Raw from "../assets/templates/base24.mustache?raw";
import Mustache from 'mustache';
// import tmp from '../assets/templates/tmp.mustache?raw';
// const tmp = import.meta.globEager('../assets/templates/*.mustache');
// console.log(tmp);



const schemeObjs = Object.fromEntries(_.entries(schemesRaw).map(([k,v]) => ([
  ((/\.\.\/assets\/schemes\/(.*)\.yaml/.exec(k)||[])[1]),
  v.default,
])));
console.log(schemeObjs);
const templateObjs: {[name: string]: string} = {
  terminalrc: terminalrcRaw,
  base24: base24Raw,
}

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

const cellStyles = _.times(N, i => ({
  "background-color": getVar(i),
  color: getVar(contrastIndex[i]),
}));

function tmpGetColorStyle(c: Color, i: number): any {
  return {
    position: 'absolute',
    left: `${c.hue()/3.6}%`,
    top: `${c.saturationv()}%`,
    "background-color": getVar(i),
    color: getVar(contrastIndex[i]),
  }
}

function tmpGetColorStyle2(c: Color, i: number): any {
  return {
    position: 'absolute',
    left: `${c.value()}%`,
    "background-color": getVar(i),
    color: getVar(contrastIndex[i]),
  }
}
/*

0,95,135,175,215,255
95,40,40,40,40
*/

/**
 * Converts integer between 0 and 255 to two digit hex.
 */
function toHex2(n: number): string {
  const rtn = n.toString(16);
  if(rtn.length === 1) {
    return "0"+rtn;
  }
  return rtn;
}
function getTemplateVariable(obj: Base24Class, slug: string) {
  const colors = obj.colors;
  return Object.fromEntries([
    ['scheme-name', obj.scheme],
    ['scheme-author', obj.author],
    ['scheme-slug', slug],
    ..._.flatMap(colors, (c, i) => [
      [base24Digits[i]+'-hex', c.hex().slice(1)], // i.e. 7cafc2
      [base24Digits[i]+'-hex-bgr', c.hex().slice(1)], // i.e. c2af7c
      [base24Digits[i]+'-hex-r', toHex2(c.red())],  // i.e. c2
      [base24Digits[i]+'-hex-g', toHex2(c.green())], // i.e. af
      [base24Digits[i]+'-hex-b', toHex2(c.blue())], // i.e. 7c
      [base24Digits[i]+'-rgb-r', c.red().toString()], // i.e. 192
      [base24Digits[i]+'-rgb-g', c.green().toString()], // i.e. 175
      [base24Digits[i]+'-rgb-b', c.blue().toString()], // i.e. 124
      [base24Digits[i]+'-dec-r', (c.red()/255).toString()], // i.e. 0.75...
      [base24Digits[i]+'-dec-g', (c.green()/255).toString()], // i.e. 0.68...
      [base24Digits[i]+'-dec-b', (c.blue()/255).toString()], // i.e. 0.48...
    ]),
  ]);
}

type Base24Class = {
  scheme: string,
  author: string,
  colors: Color[],
}

type Base24Colors = Color[];
type Base24Object = {
  scheme: string,
  author: string,
  [key: string]: string,
}

export default defineComponent({
  data(vm) {
    const colors: Color[] = _.times(N, () => Color("#000000"))

    console.log(schemeObjs);
    return {
      importExportText: "",
      scheme: "Default",
      author: "Forrest Li",
      selectedColorIndex: 0,
      selectedTemplate: "base24",
      colors: testColors,
      // tmp: {a:1,b:2},
      cellStyles,
      schemeObjs,
      templateObjs,
    }
  },
  created() {
    return {
      Color,
      cellStyles,
      // schemeObjs,
      // tmp: {a:1,b:2},
    };
  },
  computed: {
    cssVariable(): {[key: string]: string} {
      return Object.fromEntries(_.map(this.colors, (c,i) => [`--base24-${i}`, c.hex()]));
    },
    wheel(): any {
      return {
        colorStyles: _.map(this.colors, (color, i) => {
          return tmpGetColorStyle(color, i);
        }),
        colorStyles2: _.map(this.colors, (color, i) => {
          return tmpGetColorStyle2(color, i);
        }),
      }
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
      const obj = yaml.load(this.importExportText) as any;
      if(!_.isObjectLike(obj)) {
        return;
      }
      if(_.isString(obj.scheme)) {
        this.scheme=obj.scheme;
      }
      if(_.isString(obj.author)) {
        this.author = obj.author
      }
      for(let i=0;i<N;i++) {
        const value = obj[base24Digits[i]];
        if(!_.isString(value)) {
          continue;
        } else if(/^[0-9a-fA-F]{6}$/.test(value)) {
          this.colors[i] = Color("#"+value);
          // rtnEntries.push(Color("#"+value));
        } else if(/^#[0-9a-fA-F]{6}$/.test(value)) {
          this.colors[i] = Color(value);
        } else {
        }
      }
    },
    exportYaml() {
      const template = templateObjs[this.selectedTemplate]
      const view = getTemplateVariable({
        scheme: this.scheme,
        author: this.author,
        colors: this.colors,
      }, "base24-custom")
      const output = Mustache.render(template, view)
      this.importExportText = output;

      // const yamlObj = Object.fromEntries([
      //   ['scheme', this.scheme],
      //   ['author', this.author],
      //   ..._.times(N, i => [base24Digits[i], this.colors[i].hex()]),
      // ])
      // this.importExportText = yaml.dump(yamlObj);
    },
    setScheme(schemeObj: Base24Object) {
      this.scheme = schemeObj.scheme
      this.author = schemeObj.author
      for(let i=0;i<16;i++) {
        let colorStr = schemeObj[base24Digits[i]];
        if(colorStr[0] != "#") {
          colorStr = "#" + colorStr;
        }
        this.colors[i]=Color(colorStr);
      }
      for(let i=16;i<24;i++) {
        let colorStr = schemeObj[base24Digits[i]];
        if(colorStr === undefined) {
          this.colors[i]=Color(this.colors[i-8]);
        } else {
          if(colorStr[0] != "#") {
            colorStr = "#" + colorStr;
          }
          this.colors[i]=Color(colorStr);
        }
      }
    },
    changeColorText(i: number, e: Event) {
      try {
        const element = e.currentTarget as HTMLInputElement;
        this.colors[i] = Color(element.value);
      } catch (e) {
        this.colors[i] = this.colors[i];
      }
    },
  }
});

</script>
<template>
<div v-bind:style="cssVariable">
  <h1>{{ scheme }}</h1>
  <h3>{{ author }}</h3>
  <div class="scheme-list">
    <button
      v-for="(schemeObj, key) in schemeObjs"
      v-bind:key="key"
      v-on:click="setScheme(schemeObj)"
      class="scheme-cell"
    > {{ schemeObj.scheme }} </button>
  </div>
  <div class="color-list" >
    <input
      class="color-cell"
      v-on:click="selectedColorIndex = i"
      :style="cellStyles[i]"
      v-for="(color, i) in colors"
      v-bind:key="i"
      :value="color.hex().toString()"
      v-on:change="changeColorText(i, $event)"
    />
  </div>
  <span> selected: {{ selectedColorIndex }} </span>
  <button v-on:click="mixForground(0.3)">mix</button> 

  <button v-on:click="importYaml">import</button> 
  <button v-on:click="exportYaml">export</button> 
  <!-- <select v-on:change="selectedTemplate = $event.currentTarget.value"> -->
  <select v-model="selectedTemplate">
    <option
      class="template-cell"
      v-for="(template, name) in templateObjs"
      v-bind:key="name"
      default
      :value="name"
    >{{name}}</option>
  </select>
  <textarea v-model="importExportText" placeholder="add multiple lines"></textarea>
  <div class="color-wheel">
    <div
      class="color-cell"
      :style="wheel.colorStyles[i]"
      v-for="(color, i) in colors"
      v-bind:key="i"
    >{{i}}</div>
  </div>
  <div class="color-wheel2">
    <div
      class="color-cell"
      :style="wheel.colorStyles2[i]"
      v-for="(color, i) in colors"
      v-bind:key="i"
    >{{i}}</div>
  </div>

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
  padding: 10px;
  min-width: 0;
  text-align: center;
}
.color-cell:focus {
  outline: none;
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
.color-wheel {
  height: 300px;
  position: relative;
  border: black solid 1px;
}
.color-wheel2 {
  height: 20px;
  position: relative;
  border: black solid 1px;
}
</style>
