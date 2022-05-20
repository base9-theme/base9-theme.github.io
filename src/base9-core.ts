// things that should have gone to base9-core library.
import Color from 'color';
import _, { Dictionary } from 'lodash';
import { render } from 'base9-core';
import semantic from './assets/semantic.yaml';

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
