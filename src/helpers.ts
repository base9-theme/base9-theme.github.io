import Color from 'color';
import _, { Dictionary } from 'lodash';
import { render } from 'base9-core';
import semantic from './assets/semantic.yaml';

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
];
export function getCssVariableName(i: number) {
  return `--base9-${i}`;
}

export function getColors16FromSchemeObj(schemeObj: Dictionary<any>) {
  const colors16 = _.map(base24Digits, (v, k) => {
    const colorStr = schemeObj.default[v];
    if (colorStr[0] === '#') {
      return Color(colorStr);
    }
    return Color(`#${colorStr}`);
  });
  return colors16;
}

export function toColorsString(colors: ColorPalette) {
  return _.map(colors, (c) => c.hex().toString().substring(1)).join('-');
}

export function getColorsFromBase16(colors: Color[]): ColorPalette {
  return [
    colors[0],
    colors[5],
    colors[8],
    colors[9],
    colors[10],
    colors[11],
    colors[12],
    colors[13],
    colors[14],
  ];
}

export function renderWithSemantic(template: string, colors: ColorPalette) {
  return render(template, colors);
}
