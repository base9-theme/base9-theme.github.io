<script lang="ts">
import Slider from '@vueform/slider';
import { defineComponent, ref, VueElement } from 'vue'

// import tmp from '..assets'
import yaml from 'js-yaml'
import Color from 'color'
import _ from 'lodash'

const schemesRaw = import.meta.globEager("../assets/schemes/*.yaml")
import terminalrcRaw from "../assets/templates/terminalrc.mustache?raw";
import base24Raw from "../assets/templates/base24.mustache?raw";
import Mustache from 'mustache';

const schemeObjs = Object.fromEntries(_.entries(schemesRaw).map(([k,v]) => ([
  ((/\.\.\/assets\/schemes\/(.*)\.yaml/.exec(k)||[])[1]),
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

const N = 12;
const sampleColors2 = {
  dracula: "https://coolors.co/000000-282A36-F8F8F2-FFFFFF-FF5555-FFB86C-F1FA8C-50FA7B-8BE9FD-A4BEFB-BD93F9-FF79C6",
  default: "https://coolors.co/000000-181818-D8D8D8-FFFFFF-AB4642-DC9656-F7CA88-A1B56C-86C1B9-81B8BE-7CAFC2-BA8BAF",
  solarized: "https://coolors.co/000000-002b36-93a1a1-fdf6e3-dc322f-CB4B16-b58900-859900-2aa198-268BD2-6c71c4-d33682",
}

const colorsCoPrefix = "https://coolors.co/";


function distance(c1: Color, c2: Color, f: ((x: number) => number)) {
  const l1 = c1.rgb().array();
  const l2 = c2.rgb().array();
  return f(l1[0]-l2[0])+f(l1[1]-l2[1])+f(l1[2]-l2[2]);
}
function mix(cs: Color[]): Color {
  const sum = _.reduce(cs, (rgb, c) => {
    rgb[0] += c.red();
    rgb[1] += c.green();
    rgb[2] += c.blue();
    return rgb;
  },[0,0,0]);
  return Color([
    Math.ceil(sum[0]/cs.length),
    Math.ceil(sum[1]/cs.length),
    Math.ceil(sum[2]/cs.length),
  ]);
}
const getHues2Constant1 = [
  [0,1,2,3,4,5],
  [1,2,3,4,5,0],
  [2,3,4,5,0,1],
  [3,4,5,0,1,2],
  [4,5,0,1,2,3],
  [5,0,1,2,3,4],

  [5,4,3,2,1,0],
  [0,5,4,3,2,1],
  [1,0,5,4,3,2],
  [2,1,0,5,4,3],
  [3,2,1,0,5,4],
  [4,3,2,1,0,5],
];
const getHues2Constant2 = [
  Color("#FF0000"),
  Color("#FFFF00"),
  Color("#00FF00"),
  Color("#00FFFF"),
  Color("#0000FF"),
  Color("#FF00FF"),
];

function getHues2(colors: Color[]): Color[] {
  const order: number[] = _.minBy(getHues2Constant1, order =>
      distance(colors[order[0]], getHues2Constant2[0], Math.abs) +
      distance(colors[order[1]], getHues2Constant2[1], Math.abs) +
      distance(colors[order[2]], getHues2Constant2[2], Math.abs) +
      distance(colors[order[3]], getHues2Constant2[3], Math.abs) +
      distance(colors[order[4]], getHues2Constant2[4], Math.abs) +
      distance(colors[order[5]], getHues2Constant2[5], Math.abs)
  )!;
  return [
    colors[order[0]],
    colors[order[1]],
    colors[order[2]],
    colors[order[3]],
    colors[order[4]],
    colors[order[5]],
  ]
}
function getColor(cs: { [k: string]: Color }, abbr: string) {
  return mix(_.map(abbr.trim().split(""), c => cs[c]));
}

const r1 = 0.5;
const r2 = 0.25;

function getTemplateVariable(cs: { [k: string]: Color }) {
  return Object.fromEntries(_.flatMap(cs, (v,k) => {
    return [
      [k+"_hex", v.hex()],
      [k+"_r", v.red()],
      [k+"_g", v.green()],
      [k+"_b", v.blue()],
      []

    ];
  }));
}
function getMixedColors(cs: Color[], r1: number, r2: number) {
  const cs6 = [cs[4], cs[6], cs[7], cs[8], cs[10], cs[11]];
  const order: number[] = _.minBy(getHues2Constant1, order =>
      distance(cs6[order[0]], getHues2Constant2[0], Math.abs) +
      distance(cs6[order[1]], getHues2Constant2[1], Math.abs) +
      distance(cs6[order[2]], getHues2Constant2[2], Math.abs) +
      distance(cs6[order[3]], getHues2Constant2[3], Math.abs) +
      distance(cs6[order[4]], getHues2Constant2[4], Math.abs) +
      distance(cs6[order[5]], getHues2Constant2[5], Math.abs)
  )!;
  const order2 = [];
  order2[order[0]] = 0;
  order2[order[1]] = 1;
  order2[order[2]] = 2;
  order2[order[3]] = 3;
  order2[order[4]] = 4;
  order2[order[5]] = 5;

  const cs2 = [
    cs6[order[0]],
    cs6[order[1]],
    cs6[order[2]],
    cs6[order[3]],
    cs6[order[4]],
    cs6[order[5]],
  ];
  
  const extra = {
    bg_d: cs[0],
    bg_s: cs[0],
    bg: cs[1],
    // c0_d: cs[2 ].mix(cs[1], 1-r2), c0_s: cs[2 ].mix(cs[1],r2), c0: cs[2 ], c0_h: cs[2 ].mix(cs[3], r1),
    // C0_BG, C0_B, C0, C0_W
    c0_d: cs[2 ].mix(cs[1], 1-r2), c0_s: cs[2 ].mix(cs[1],r2), c0: cs[2 ], c0_h: cs[3],
    c1_d: cs[4 ].mix(cs[1], 1-r2), c1_s: cs[4 ].mix(cs[1],r2), c1: cs[4 ], c1_h: cs[4 ].mix(cs[3], r1),
    c2_d: cs[5 ].mix(cs[1], 1-r2), c2_s: cs[5 ].mix(cs[1],r2), c2: cs[5 ], c2_h: cs[5 ].mix(cs[3], r1),
    c3_d: cs[6 ].mix(cs[1], 1-r2), c3_s: cs[6 ].mix(cs[1],r2), c3: cs[6 ], c3_h: cs[6 ].mix(cs[3], r1),
    c4_d: cs[7 ].mix(cs[1], 1-r2), c4_s: cs[7 ].mix(cs[1],r2), c4: cs[7 ], c4_h: cs[7 ].mix(cs[3], r1),
    c5_d: cs[8 ].mix(cs[1], 1-r2), c5_s: cs[8 ].mix(cs[1],r2), c5: cs[8 ], c5_h: cs[8 ].mix(cs[3], r1),
    c6_d: cs[9 ].mix(cs[1], 1-r2), c6_s: cs[9 ].mix(cs[1],r2), c6: cs[9 ], c6_h: cs[9 ].mix(cs[3], r1),
    c7_d: cs[10].mix(cs[1], 1-r2), c7_s: cs[10].mix(cs[1],r2), c7: cs[10], c7_h: cs[10].mix(cs[3], r1),
    c8_d: cs[11].mix(cs[1], 1-r2), c8_s: cs[11].mix(cs[1],r2), c8: cs[11], c8_h: cs[11].mix(cs[3], r1),

    cr_d: cs2[0].mix(cs[1], 1-r2), cr_s: cs2[0].mix(cs[1],r2), cr: cs2[0], cr_h: cs2[0].mix(cs[3], r1),
    cy_d: cs2[1].mix(cs[1], 1-r2), cy_s: cs2[1].mix(cs[1],r2), cy: cs2[1], cy_h: cs2[1].mix(cs[3], r1),
    cg_d: cs2[2].mix(cs[1], 1-r2), cg_s: cs2[2].mix(cs[1],r2), cg: cs2[2], cg_h: cs2[2].mix(cs[3], r1),
    cc_d: cs2[3].mix(cs[1], 1-r2), cc_s: cs2[3].mix(cs[1],r2), cc: cs2[3], cc_h: cs2[3].mix(cs[3], r1),
    cb_d: cs2[4].mix(cs[1], 1-r2), cb_s: cs2[4].mix(cs[1],r2), cb: cs2[4], cb_h: cs2[4].mix(cs[3], r1),
    cm_d: cs2[5].mix(cs[1], 1-r2), cm_s: cs2[5].mix(cs[1],r2), cm: cs2[5], cm_h: cs2[5].mix(cs[3], r1),

    // c1_ansi: order2[0],
    // c3_ansi: order2[1],
    // c4_ansi: order2[2],
    // c5_ansi: order2[3],
    // c7_ansi: order2[4],
    // c8_ansi: order2[5],
    // c1_h_ansi: order2[0]+8,
    // c3_h_ansi: order2[1]+8,
    // c4_h_ansi: order2[2]+8,
    // c5_h_ansi: order2[3]+8,
    // c7_h_ansi: order2[4]+8,
    // c8_h_ansi: order2[5]+8,
  }
  return extra;
}

const contrastIndex = [2,2,0,0,0,0,0,0,0,0,0,0];
const previewListRows = "012345678";
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
  components: {
    Slider
  },
  data(vm) {
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
    expandedColors() {
      return getMixedColors(this.colors, this.r1, this.r2);
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
            bg: this.expandedColors['bg_s'],
            fg: this.expandedColors['bg_d'],
          };
        }
        const cbg = this.expandedColors[bg(c)];
        const cfg = this.expandedColors[fg(c)];
        return {
          bg: cbg,
          fg: cfg,
        };
      }));
    },
    ansiList() {
      const m = this.expandedColors;
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
    getPreviewStyle(c: string) {
      const color = getColor(this.expanedColors, c);
      return {
        background: color.hex().toString(),
      }
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
        iw[0],
        c16[0],
        c16[5],
        iw[1],
        c16[8],
        c16[9],
        c16[10],
        c16[11],
        c16[12],
        c16[12].mix(c16[13]),
        c16[13],
        c16[14],
      ]
    },
    changeColorsCo(url: string) {
      this.colors = changeColorsCo(url);
    },
  }
});
</script>
<template>
<div v-bind:style="cssVariable">
  <Slider
    style="width: 30%"
    :max="1"
    :min="0"
    :step="0.01"
    :format="{decimals:2}"
    v-model="r1"
  />
  <Slider
    style="width: 30%"
    :max="1"
    :min="0"
    :step="0.01"
    :format="{decimals:2}"
    v-model="r2"
  />
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
      :style="{ background: colors[1].hex(), color: colors[2].hex()}"
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
      :style="{ background: c.hex(), color: white}"
      v-for="(c, i) in ansiList"
      v-bind:key="i"
    >
      {{c.hex()}}
    </div>
  </div>


  <input class="colors-co-input"
    :value="colorsCoString"
    v-on:change="changeColorsCo($event.value)"
  />
  <span> selected: {{ selectedColorIndex }} </span>
  <button v-on:click="reorder([3,2,1,0,4,5,6,7,8,9,10,11])">dark/light</button> 
  <button v-on:click="reorder([0,1,2,3,8,9,10,11,4,5,6,7])">inverse hue</button> 
  <button v-on:click="reorder([0,1,2,3,6,5,4,11,10,9,8,7])">mirror hue</button> 
</div>
</template>
<style src="@vueform/slider/themes/default.css"></style>
<style scoped>
.color-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
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
  background: var(--base12-0);
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
