// import * as Color from 'color'
// import * as _ from 'lodash'
// import * as Mustache from 'mustache';
import Color from 'color'
import _ from 'lodash'
import Mustache from 'mustache';

import { getNamedColors, NamedColors } from './colors';

export function getTemplateVariable(cs: NamedColors) {
  return Object.fromEntries(_.flatMap(cs, (v,k) => {
    return [
      [k+"_hex", v.hex()],
    ];
  }));
}
export function render(template: string, cs: Color[]) {
    const namedColors = getNamedColors(cs);
    const view = getTemplateVariable(namedColors);
    return Mustache.render(template, view)
}

// import {readFileSync, writeFileSync} from 'fs';
// if (require && require.main === module) {
//     console.log(process.argv);
//     process.exit(0);
//     const template = readFileSync(process.argv[0]).toString();
//     const cs = _.map(process.argv[2].split("-"), c => Color("#"+c));
//     const output = render(template, cs);
//     writeFileSync(process.argv[1], output);
    
// }