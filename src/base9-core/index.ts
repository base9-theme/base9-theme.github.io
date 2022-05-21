import Color from 'color';
import _, { Dictionary } from 'lodash';
import Mustache from 'mustache';
import { rgb, xyz } from 'color-convert';
import type { RGB } from 'color-convert/conversions';
import semantic from './semantic';

/** List of 9 colors */
export type ColorPalette = [
  Color, Color, Color, Color, Color, Color, Color, Color, Color,
];

export const PALETTE_REGEX = /^([0-9a-fA-F]{6}-){8}[0-9a-fA-F]{6}$/;

export function toPaletteString(colors: ColorPalette) {
  return _.map(colors, (c) => c.hex().toString().substring(1)).join('-');
}

export function fromPaletteString(palette: string): ColorPalette | undefined {
  if (!PALETTE_REGEX.test(palette)) {
    return undefined;
  }
  return _.map(palette.split('-'), (s) => Color(`#${s}`)) as ColorPalette;
}

function mixRaw(a: number, b: number, ratio: number) {
  return a * (1 - ratio) + b * ratio;
}

type ColorModel = 'rgb'|'lab';

function customMix(c1: Color, c2: Color, ratio: number) {
  const c1xyz = rgb.xyz(c1.rgb().array() as RGB);
  const c2xyz = rgb.xyz(c2.rgb().array() as RGB);
  const c1lab = xyz.lab(c1xyz);
  const c2lab = xyz.lab(c2xyz);
  // color convert uses 0-100 for xyz.
  const c1contrast = Math.log(c1xyz[1] + 5);
  const c2contrast = Math.log(c2xyz[1] + 5);
  const c3contrast = mixRaw(c1contrast, c2contrast, ratio);
  const c3y = Math.exp(c3contrast) - 5;
  const c3l = xyz.lab([0, c3y, 0])[0];
  const c3lab = [
    c3l,
    mixRaw(c1lab[1], c2lab[1], ratio),
    mixRaw(c1lab[2], c2lab[2], ratio),
  ];
  return Color.lab(c3lab).rgb();
}

class ColorWithFormat {
  constructor(public color: Color) {}

  get hex() { return this.color.hex().substring(1); }

  get hexbgr() { const x = this.hex; return x[4] + x[5] + x[2] + x[3] + x[0] + x[1]; }

  get hexr() { return this.color.red().toString(16).padStart(2, '0'); }

  get hexg() { return this.color.green().toString(16).padStart(2, '0'); }

  get hexb() { return this.color.blue().toString(16).padStart(2, '0'); }

  get decr() { return this.color.red().toString(); }

  get decg() { return this.color.green().toString(); }

  get decb() { return this.color.blue().toString(); }

  get fracr() { return (this.color.red() / 255).toString(); }

  get fracg() { return (this.color.green() / 255).toString(); }

  get fracb() { return (this.color.blue() / 255).toString(); }
}

// a = "asd",)]
// 282936-e9e9f4-ffffff-ea51b2-b45bcf-00f769-ebff87-a1efe4-62d6e8-b45bcf
// 282936-e9e9f4-ffffff-ff5555-ffb86c-f1fa8c-50fa7b-8be9fd-bd93f9-ff79c6

// - &SELECTION '#44475A'
//     - &COMMENT   '#6272A4'
//     - &CYAN      '#8BE9FD'
//     - &GREEN     '#50FA7B'
//     - &ORANGE    '#FFB86C'
//     - &PINK      '#FF79C6'
//     - &PURPLE    '#BD93F9'
//     - &RED       '#FF5555'
//     - &YELLOW    '#F1FA8C'

function difference(c1: Color, c2: Color) {
  const f = Math.abs;
  const l1 = c1.rgb().array();
  const l2 = c2.rgb().array();
  return f(l1[0] - l2[0]) + f(l1[1] - l2[1]) + f(l1[2] - l2[2]);
}

function iteratePermutations(f: (order: number[]) => void) {
  // c is an encoding of the stack state. c[k] encodes the for-loop counter for when generate(k - 1, A) is called
  const c = [0, 0, 0, 0, 0, 0, 0];
  const A = [0, 1, 2, 3, 4, 5, 6];
  f(A);

  const n = 7;
  let tmp = 0;
  let i = 0;
  while (i < n) {
    if (c[i] < i) {
      const swapI = (i % 2) === 0 ? 0 : c[i];
      tmp = A[swapI];
      A[swapI] = A[i];
      A[i] = tmp;
      f(A);

      c[i] += 1;
      i = 0;
    } else {
      c[i] = 0;
      i += 1;
    }
  }
}

const hues = [
  Color('#FF0000'),
  Color('#FFFF00'),
  Color('#00FF00'),
  Color('#00FFFF'),
  Color('#0000FF'),
  Color('#FF00FF'),
];

function getTrueColorOrder(colors: ColorWithFormat[]) {
  let min = Infinity;
  let minOrder: number[] = [];
  iteratePermutations((order) => {
    const diff = difference(colors[order[0]].color, hues[0])
            + difference(colors[order[1]].color, hues[1])
            + difference(colors[order[2]].color, hues[2])
            + difference(colors[order[3]].color, hues[3])
            + difference(colors[order[4]].color, hues[4])
            + difference(colors[order[5]].color, hues[5]);
    if (min > diff) {
      min = diff;
      minOrder = order.slice();
    }
  });
  return minOrder;
}
// purpose.variant
type Semantic = Dictionary<string|undefined>[];
type Config = {
    mapping: Semantic,
    r1: number,
    r2: number,
    todoSize: number,
}
export const defaultConfig: Config = {
  mapping: semantic.mappings,
  r1: 0.25,
  r2: 0.5,
  todoSize: 1000,
};

type ColorMap = Map<string, ColorWithFormat|ColorMap>;

function isColorWithFormat(obj: Object): obj is ColorWithFormat {
  return obj.constructor === ColorWithFormat;
}

function getMapByKeys(map: ColorMap, keys: string[]): ColorMap {
  let mapIter = map;
  _.each(keys.slice(0, keys.length - 1), (k, i) => {
    if (mapIter.has(k)) {
      const tmpIter = mapIter.get(k)!;
      if (isColorWithFormat(tmpIter)) {
        throw new Error(`${keys.slice(0, i)} is already a color when writing ${keys.join('.')}`);
      }
      mapIter = tmpIter;
    } else {
      const tmp = new Map<string, ColorMap|ColorWithFormat>();
      mapIter.set(k, tmp);
      mapIter = tmp;
    }
  });
  return mapIter;
}

function mapToObj(map: Map<string, ColorWithFormat|ColorMap>): NamedColors {
  return Object.fromEntries(_.map(Array.from(map.entries()), ([k, v]: [string, ColorMap | ColorWithFormat], i): [string, NamedColors|ColorWithFormat] => {
    if (isColorWithFormat(v)) {
      return [k, v];
    }
    return [k, mapToObj(v)];
  }));
}

export function getNamedColors(palette: Color[], cfg: Config = defaultConfig): NamedColors {
  const paletteWithFormat = _.map(palette, (c) => new ColorWithFormat(c));
  // const cfg = defaultConfig;
  const background = paletteWithFormat[0];
  const foreground = paletteWithFormat[1];
  const colors = paletteWithFormat.slice(2);
  const order = getTrueColorOrder(colors);
  const map = new Map<string, ColorMap|ColorWithFormat>();

  function setColor(key: string, c: ColorWithFormat) {
    const m = new Map<string, ColorWithFormat>();
    m.set('o', c);
    m.set('b', new ColorWithFormat(customMix(c.color, background.color, 1 - cfg.r1)));
    m.set('m', new ColorWithFormat(customMix(c.color, background.color, cfg.r2)));
    m.set('s', new ColorWithFormat(customMix(c.color, background.color, cfg.r1)));
    m.set('h', new ColorWithFormat(customMix(c.color, foreground.color, cfg.r2)));
    map.set(key, m);
  }
  setColor('c1', colors[0]);
  setColor('c2', colors[1]);
  setColor('c3', colors[2]);
  setColor('c4', colors[3]);
  setColor('c5', colors[4]);
  setColor('c6', colors[5]);
  setColor('c7', colors[6]);

  map.set('red', map.get(`c${order[0] + 1}`)!);
  map.set('yellow', map.get(`c${order[1] + 1}`)!);
  map.set('green', map.get(`c${order[2] + 1}`)!);
  map.set('cyan', map.get(`c${order[3] + 1}`)!);
  map.set('blue', map.get(`c${order[4] + 1}`)!);
  map.set('magenta', map.get(`c${order[5] + 1}`)!);

  const backgroundMap = new Map<string, ColorWithFormat>();
  backgroundMap.set('o', background);
  backgroundMap.set('s', new ColorWithFormat(customMix(background.color, foreground.color, cfg.r1)));
  backgroundMap.set('ss', new ColorWithFormat(customMix(background.color, foreground.color, cfg.r1 / 2)));
  map.set('background', backgroundMap);

  const foregroundMap = new Map<string, ColorWithFormat>();
  foregroundMap.set('o', foreground);
  foregroundMap.set('s', new ColorWithFormat(customMix(foreground.color, background.color, cfg.r1)));
  foregroundMap.set('ss', new ColorWithFormat(customMix(foreground.color, background.color, cfg.r2)));
  map.set('foreground', foregroundMap);

  const todoMap = new Map<string, ColorWithFormat>();
  const todoBase = [
    new ColorWithFormat(Color('#FFFFFF')), // white
    new ColorWithFormat(Color('#FF0000')), // red
    new ColorWithFormat(Color('#FFFF00')), // yellow
    new ColorWithFormat(Color('#00FF00')), // green
    new ColorWithFormat(Color('#00FFFF')), // cyan
    new ColorWithFormat(Color('#0000FF')), // blue
    new ColorWithFormat(Color('#FF00FF')), // magenta
    new ColorWithFormat(Color('#FF8000')), // orange
    new ColorWithFormat(Color('#000000')), // black
    new ColorWithFormat(Color('#808080')), // gray
  ];
  _.each(todoBase, (c, i) => {
    todoMap.set(`base${i}`, c);
  });
  _.times(500, (i) => {
    todoMap.set(`c${i}`, todoBase[i % todoBase.length]);
  });
  map.set('todo', todoMap);

  _.each(cfg.mapping, (obj, i) => {
    const objKey = _.keys(obj);
    if (objKey.length !== 1) {
      throw new Error(`More than 1 key at ${i}-th obj`);
    }
    const keys = objKey[0].split('.');
    const values = obj[objKey[0]]!.split('.');

    const keyMap = getMapByKeys(map, keys);
    const valueMap = getMapByKeys(map, values);
    const valueObj = valueMap.get(values[values.length - 1]);

    if (valueObj === undefined) {
      throw new Error(`Cannot fetch '${values.join('.')}'`);
    }
    keyMap.set(keys[keys.length - 1], valueObj);
  });
  return mapToObj(map);
}

export type NamedColors = { [k: string]: ColorWithFormat&NamedColors&undefined };

export function render(template: string, cs: Color[], cfg: Config = defaultConfig) {
  const namedColors = getNamedColors(cs, cfg);
  return Mustache.render(template, namedColors);
}
