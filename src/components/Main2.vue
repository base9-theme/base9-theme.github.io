<script lang="ts">
import { defineComponent, ref, VueElement } from 'vue'

// import tmp from '..assets'
import yaml from 'js-yaml'
import Color from 'color'
import _ from 'lodash'
import {getNamedColors} from '../colors';
import {render} from '../template';

const schemesRaw = import.meta.globEager("../assets/schemes-base16/*.yaml")
import terminalrcRaw from "../assets/templates/terminalrc.mustache?raw";
import base24Raw from "../assets/templates/base24.mustache?raw";
import Mustache from 'mustache';


const schemeObjs = Object.fromEntries(_.entries(schemesRaw).map(([k,v]) => ([
  ((/\.\.\/assets\/schemes-base16\/(.*)\.yaml/.exec(k)||[])[1]),
  v.default,
])));

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

const N = 10;
const colorsCoPrefix = "https://coolors.co/";
const sampleColors2 = {
  dracula: colorsCoPrefix+"282A36-F8F8F2-FFFFFF-FF5555-FFB86C-F1FA8C-50FA7B-8BE9FD-BD93F9-FF79C6",
  default: colorsCoPrefix+"181818-D8D8D8-FFFFFF-AB4642-DC9656-F7CA88-A1B56C-86C1B9-7CAFC2-BA8BAF",
  solarized: colorsCoPrefix+"002b36-93a1a1-fdf6e3-dc322f-CB4B16-b58900-859900-2aa198-6c71c4-d33682",
}



const contrastIndex = [2,0,0,0,0,0,0,0,0,0];
const previewListRows = "0123456";
const previewListColumns: [string, ((c: string) => string), ((c: string) => string)][] = [
  ["cx_d", c => `c${c}_d`, c => `c${c}`],
  ["cx_s", c => `c${c}_s`, c => `c${c}_d`],
  ["cx", c => `c${c}`, c => `c${c}_d`],
  ["cx_h", c => `c${c}_h`, c => `c${c}_d`],
  ["Colored Bg", c => `c${c}_d`, c => `c0`],
  ["Brighter Bg", c => `c0_d`, c => `c${c}`],
  ["Darker Fg", c => `bg`, c => `c${c}_s`],
  ["Normal", c => `bg`, c => `c${c}`],
  ["Brighter Fg", c => `bg`, c => `c${c}_h`],
];

function getVar(i: number|string) {
  return `var(--base${N}-${i})`;
}

const cellStyles = _.times(N, i => ({
  "background-color": getVar(i),
  color: getVar(contrastIndex[i]),
}));

function changeColorsCo(url: string): Color[] {
  if(!_.startsWith(url, colorsCoPrefix)) {
    return [];
  } else {
    url = url.substring(colorsCoPrefix.length);
    return _.map(url.split("-"), s => Color(`#${s}`));
  }
}

export default defineComponent({
  data(vm) {
    debugger;
    const colors = changeColorsCo(sampleColors2.dracula);
    return {
      selectedColorIndex: 0,
      r1: 0.5,
      r2: 0.25,
      colors,
      schemeObjs,
      cellStyles,
      previewListRows,
      previewListColumns,
      previewNumber: (bg: Color, fg: Color) => {
        return fg.contrast(bg);
      },
    }
  },
  created() {
    return {
      Color,
      _,
    };
  },
  computed: {
    cssVariable(): {[key: string]: string} {
      return Object.fromEntries(_.map(this.colors, (c,i) => [`--base${N}-${i}`, c.hex()]));
    },
    namedColors() {
      return getNamedColors(this.colors, this.r1, this.r2);
    },
    colorsCoString(): string {
      return colorsCoPrefix+
        _.map(this.colors, c => c.hex().toString().toLowerCase().substring(1)).join("-");
    },
    previewList() {
      // return _.flatMap(bgfg, ([bg,fg]) => _.map("012345678rygcbm".split(""), c => {
      return _.flatMap(previewListRows.split(""), c =>  _.map(previewListColumns, ([s, bg,fg]) => {
        if(c === ' ') {
          return {
            bg: this.namedColors.bg,
            fg: this.namedColors.bg,
          };
        }
        const cbg = this.namedColors[bg(c)];
        const cfg = this.namedColors[fg(c)];
        return {
          bg: cbg,
          fg: cfg,
        };
      }));
    },
    ansiList() {
      const m = this.namedColors;
      return [
        m.bg,   m.cr,   m.cg,   m.cy,   m.cb,   m.cm,   m.cc,   m.c0,
        m.c0_d, m.cr_h, m.cg_h, m.cy_h, m.cb_h, m.cm_h, m.cc_h, m.c0_h,
      ];
    },
  },
  props: {
    msg: String,
  },
  methods: {
    setColor(i: number, c: Color) {
      this.colors[i] = c;
    },
    changeColorText(i: number, e: Event) {
      try {
        const element = e.currentTarget as HTMLInputElement;
        this.colors[i] = Color(element.value);
      } catch (e) {
        // this.colors[i] = this.colors[i];
      }
    },
    reorder(order: number[]) {
      this.colors = _.map(order, i => this.colors[i]);
    },
    setScheme(schemeObj: any) {
      function tmp(i: number) {
        let colorStr = schemeObj[base24Digits[i]];
        if(colorStr[0] != "#") {
          colorStr = "#" + colorStr;
        }
        return Color(colorStr);
      }
      const c16 = _.times(16, tmp);
      let iw = [Color("#000000"), Color("#FFFFFF")];
      if(c16[0].lightness() > c16[5].lightness()) {
        iw = [iw[1],iw[0]];
      }
      
      this.colors = [
        c16[0],
        c16[5],
        iw[1],
        c16[8],
        c16[9],
        c16[10],
        c16[11],
        c16[12],
        c16[13],
        c16[14],
      ]
    },
    changeColorsCo(e: Event) {
      const element = e.currentTarget as HTMLInputElement;
      this.colors = changeColorsCo(element.value);
    },
  }
});
</script>
<template>
<div v-bind:style="cssVariable">
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
  <div
    class="preview-list"
    :style="{'grid-template-columns': '1fr '.repeat(previewListColumns.length) }"
  >
    <div
      class="preview-cell"
      :style="{ background: namedColors.bg.hex(), color: namedColors.c0.hex()}"
      v-for="([s], i) in previewListColumns"
      v-bind:key="i"
    >
      {{s}}
    </div>
    <div
      class="preview-cell"
      :style="{ background: bg.hex(), color: fg.hex()}"
      v-for="({bg,fg}, i) in previewList"
      v-bind:key="i"
    >
      {{previewNumber(bg,fg).toFixed(3)}}
      <!-- {{fg.luminosity().toFixed(3)}} {{bg.luminosity().toFixed(3)}} -->
    </div>
  </div>
  <div
    class="ansi-list"
  >
    <div
      class="ansi-cell"
      :style="{ background: c.hex(), color: 'white'}"
      v-for="(c, i) in ansiList"
      v-bind:key="i"
    >
      {{c.hex()}}
    </div>
  </div>


  <input class="colors-co-input"
    :value="colorsCoString"
    v-on:change="changeColorsCo"
  />
  <span> selected: {{ selectedColorIndex }} </span>
  <button v-on:click="reorder([0,1,2,5,4,3,9,8,7,6])">mirror hue</button> 
  <div class="wheel">
    <div
      v-for="(v,i) in colors.slice(3)"
      v-bind:key="i"
      :style="{
        left: v.hue()/3.6 + '%',
        top: v.saturationl() + '%',
        'background-color': v.hex(),
      }"
    ></div>
  </div>
</div>
</template>
<style src="@vueform/slider/themes/default.css"></style>
<style scoped>
.color-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
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
.preview-list {
  display: grid;
  column-gap: 2px;
  background: var(--base10-0);
  /* grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; */
}
.preview-cell {
  height: 20px;
}
.colors-co-input {
  width: 100%;
}
.ansi-list {
  display: grid;
  /* column-gap: 2px;
  background: var(--base12-0); */
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.preview-cell {
  height: 20px;
}

.wheel {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px black solid;
}
.wheel > div {
  position: absolute;
  width:40px;
  height: 40px;
  border-radius: 50%;
  transform: translate(-50%,-50%);
  font-size: 10px;
}
</style>
