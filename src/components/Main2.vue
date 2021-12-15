<script lang="ts">
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

const N = 10;
const sampleColors2 = {
  dracula: "https://coolors.co/000000-282A36-F8F8F2-FFFFFF-FF5555-F1FA8C-50FA7B-8BE9FD-BD93F9-FF79C6",
  default: "https://coolors.co/000000-181818-D8D8D8-FFFFFF-AB4642-F7CA88-A1B56C-86C1B9-7CAFC2-BA8BAF",
  solarized: "https://coolors.co/000000-002b36-93a1a1-fdf6e3-dc322f-b58900-859900-2aa198-6c71c4-d33682",
// " blue      #268bd2  4/4 blue      33 #0087ff 55 -10 -45  38 139 210 205  82  82
// " orange    #cb4b16  9/3 brred    166 #d75f00 50  50  55 203  75  22  18  89  80
}
// " blue      #268bd2  4/4 blue      33 #0087ff 55 -10 -45  38 139 210 205  82  82
// " orange    #cb4b16  9/3 brred    166 #d75f00 50  50  55 203  75  22  18  89  80

// base03    #002b36  8/4 brblack  234 #1c1c1c 15 -12 -12   0  43  54 193 100  21
// " base02    #073642  0/4 black    235 #262626 20 -12 -12   7  54  66 192  90  26
// " base01    #586e75 10/7 brgreen  240 #4e4e4e 45 -07 -07  88 110 117 194  25  46
// " base00    #657b83 11/7 bryellow 241 #585858 50 -07 -07 101 123 131 195  23  51
// " base0     #839496 12/6 brblue   244 #808080 60 -06 -03 131 148 150 186  13  59
// " base1     #93a1a1 14/4 brcyan   245 #8a8a8a 65 -05 -02 147 161 161 180   9  63
// " base2     #eee8d5  7/7 white    254 #d7d7af 92 -00  10 238 232 213  44  11  93
// " base3     #fdf6e3 15/7 brwhite  230 #ffffd7 97  00  10 253 246 227  44  10  99

const colorsCoPrefix = "https://coolors.co/";

const r1 = 0.5;
const r2 = 0.25;

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

function getHues2(hue1: any) {
  const colors = [
    hue1["1"],
    hue1["2"],
    hue1["3"],
    hue1["4"],
    hue1["5"],
    hue1["6"],
  ];
  const order: number[] = _.minBy(getHues2Constant1, order =>
      distance(colors[order[0]], getHues2Constant2[0], Math.abs) +
      distance(colors[order[1]], getHues2Constant2[1], Math.abs) +
      distance(colors[order[2]], getHues2Constant2[2], Math.abs) +
      distance(colors[order[3]], getHues2Constant2[3], Math.abs) +
      distance(colors[order[4]], getHues2Constant2[4], Math.abs) +
      distance(colors[order[5]], getHues2Constant2[5], Math.abs)
  )!;
  return {
    r: colors[order[0]],
    y: colors[order[1]],
    g: colors[order[2]],
    c: colors[order[3]],
    b: colors[order[4]],
    m: colors[order[5]],
  }
}
function getColor(cs: { [k: string]: Color }, abbr: string) {
  return mix(_.map(abbr.trim().split(""), c => cs[c]));
}

function getTemplateVariable(cs: Color[]) {
  const hues1 = {
    i: cs[0],
    d: cs[1],
    l: cs[2],
    w: cs[3],
    "1": cs[4],
    "2": cs[5],
    "3": cs[6],
    "4": cs[7],
    "5": cs[8],
    "6": cs[9],
  }
  const hues2  = getHues2(hues1);
  return _.assign({}, hues1, hues2);
  // const colorsWithShades: { [k: string]: Color } = Object.fromEntries(_.flatMap(colors, (v, k) => [
  //     [k, v],
  //     [k+"_bg", v.mix(bgfg.bg, 1-r2)],
  //     [k+"_bright", v.mix(bgfg.fg_brightest, r1)],
  //     [k+"_dark", v.mix(bgfg.bg, r2)],
  // ]));
}

const contrastIndex = [2,2,0,0,0,0,0,0,0,0];

function getVar(i: number|string) {
  return `var(--base10-${i})`;
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

function changeColorsCo(url: string): Color[] {
  if(!_.startsWith(url, colorsCoPrefix)) {
    return [];
  } else {
    url = url.substring(colorsCoPrefix.length);
    return _.map(url.split("-"), s => Color(`#${s}`));
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

export default defineComponent({
  data(vm) {
    const colors = changeColorsCo(sampleColors2.dracula);
    return {
      selectedColorIndex: 0,
      colors,
      schemeObjs,
      previewList: [
        "ww      ","ww      ","ww      ","ww      ","ww      ","ww      ","ww      ","ww      ","ww      ","ww      ","ww      ","ww      ","ww      ",
        "wwll    ","ww11    ","ww12    ","ww22    ","ww23    ","ww33    ","ww34    ","ww44    ","ww45    ","ww55    ","ww56    ","ww61    ","ww66    ",
        "ll      ","11      ","12      ","22      ","23      ","33      ","34      ","44      ","45      ","55      ","56      ","61      ","66      ",
        "ddllll  ","dd1111  ","dd1212  ","dd2222  ","dd2323  ","dd3333  ","dd3434  ","dd4444  ","dd4545  ","dd5555  ","dd5656  ","dd6161  ","dd6666  ",
        "lldddd  ","11dddd  ","12dddd  ","22dddd  ","23dddd  ","33dddd  ","34dddd  ","44dddd  ","45dddd  ","55dddd  ","56dddd  ","61dddd  ","66dddd  ",
        "dd      ","dd      ","dd      ","dd      ","dd      ","dd      ","dd      ","dd      ","dd      ","dd      ","dd      ","dd      ","dd      ",
        "iidd    ","iidd    ","iidd    ","iidd    ","iidd    ","iidd    ","iidd    ","iidd    ","iidd    ","iidd    ","iidd    ","iidd    ","iidd    ",
        "ii      ","ii      ","ii      ","ii      ","ii      ","ii      ","ii      ","ii      ","ii      ","ii      ","ii      ","ii      ","ii      ",
      ],
      // tmp: {a:1,b:2},
      cellStyles,
    }
  },
  created() {
    return {
      Color,
      // cellStyles,
      // schemeObjs,
      // tmp: {a:1,b:2},
    };
  },
  computed: {
    cssVariable(): {[key: string]: string} {
      return Object.fromEntries(_.map(this.colors, (c,i) => [`--base10-${i}`, c.hex()]));
    },
    expanedColors() {
      return getTemplateVariable(this.colors);
    },
    colorsCoString(): string {
      return colorsCoPrefix+
        _.map(this.colors, c => c.hex().toString().toLowerCase().substring(1)).join("-");
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
    setScheme(schemeObj: any) {
      function tmp(i: number) {
        let colorStr = schemeObj[base24Digits[i]];
        if(colorStr[0] != "#") {
          colorStr = "#" + colorStr;
        }
        return Color(colorStr);
      }
      this.colors = [
        Color("#000000"),
        tmp(0),
        tmp(5),
        Color("#FFFFFF"),
        tmp(8),
        tmp(10),
        tmp(11),
        tmp(12),
        tmp(13),
        tmp(14),
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
  <div class="preview-list" >
    <div
      class="preview-cell"
      :style="getPreviewStyle(c)"
      v-for="(c, i) in previewList"
      v-bind:key="i"
    >
      {{getPreviewStyle(c).background}}
    </div>
  </div>


  <input class="colors-co-input"
    :value="colorsCoString"
    v-on:change="changeColorsCo($event.value)"
  />
  <span> selected: {{ selectedColorIndex }} </span>
</div>
</template>

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
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.preview-cell {
  height: 20px;
}
.colors-co-input {
  width: 100%;
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
