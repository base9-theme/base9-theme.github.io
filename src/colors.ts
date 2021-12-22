import Color from 'color'
import _ from 'lodash'


export function difference(c1: Color, c2: Color) {
    const f = Math.abs;
    const l1 = c1.rgb().array();
    const l2 = c2.rgb().array();
    return f(l1[0] - l2[0]) + f(l1[1] - l2[1]) + f(l1[2] - l2[2]);
}

const getHues2Constant1 = [
    [0, 1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5, 0],
    [2, 3, 4, 5, 0, 1],
    [3, 4, 5, 0, 1, 2],
    [4, 5, 0, 1, 2, 3],
    [5, 0, 1, 2, 3, 4],

    [5, 4, 3, 2, 1, 0],
    [0, 5, 4, 3, 2, 1],
    [1, 0, 5, 4, 3, 2],
    [2, 1, 0, 5, 4, 3],
    [3, 2, 1, 0, 5, 4],
    [4, 3, 2, 1, 0, 5],
];
const getHues2Constant2 = [
    Color("#FF0000"),
    Color("#FFFF00"),
    Color("#00FF00"),
    Color("#00FFFF"),
    Color("#0000FF"),
    Color("#FF00FF"),
];

export function getNamedColors(cs: Color[], r1: number = 0.5, r2: number = 0.25): { [k: string]: Color } {
    const cs6 = [cs[3], cs[5], cs[6], cs[7], cs[8], cs[9]];
    const order: number[] = _.minBy(getHues2Constant1, order =>
        difference(cs6[order[0]], getHues2Constant2[0]) +
        difference(cs6[order[1]], getHues2Constant2[1]) +
        difference(cs6[order[2]], getHues2Constant2[2]) +
        difference(cs6[order[3]], getHues2Constant2[3]) +
        difference(cs6[order[4]], getHues2Constant2[4]) +
        difference(cs6[order[5]], getHues2Constant2[5])
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
    const bg = cs[0];
    const wt = cs[2];

    return {
        bg,
        //fg_d: cs[2].mix(bg, 1 - r2), fg_s: cs[2].mix(bg, r2), fg: cs[2], fg_h: wt,
        c0_d: cs[2].mix(bg, 1 - r2), c0_s: cs[2].mix(bg, r2), c0: cs[2], c0_h: wt,
        c1_d: cs[4].mix(bg, 1 - r2), c1_s: cs[4].mix(bg, r2), c1: cs[4], c1_h: cs[4].mix(wt, r1),
        c2_d: cs[5].mix(bg, 1 - r2), c2_s: cs[5].mix(bg, r2), c2: cs[5], c2_h: cs[5].mix(wt, r1),
        c3_d: cs[6].mix(bg, 1 - r2), c3_s: cs[6].mix(bg, r2), c3: cs[6], c3_h: cs[6].mix(wt, r1),
        c4_d: cs[7].mix(bg, 1 - r2), c4_s: cs[7].mix(bg, r2), c4: cs[7], c4_h: cs[7].mix(wt, r1),
        c5_d: cs[8].mix(bg, 1 - r2), c5_s: cs[8].mix(bg, r2), c5: cs[8], c5_h: cs[8].mix(wt, r1),
        c6_d: cs[9].mix(bg, 1 - r2), c6_s: cs[9].mix(bg, r2), c6: cs[9], c6_h: cs[9].mix(wt, r1),

        cr_d: cs2[0].mix(bg, 1 - r2), cr_s: cs2[0].mix(bg, r2), cr: cs2[0], cr_h: cs2[0].mix(wt, r1),
        cy_d: cs2[1].mix(bg, 1 - r2), cy_s: cs2[1].mix(bg, r2), cy: cs2[1], cy_h: cs2[1].mix(wt, r1),
        cg_d: cs2[2].mix(bg, 1 - r2), cg_s: cs2[2].mix(bg, r2), cg: cs2[2], cg_h: cs2[2].mix(wt, r1),
        cc_d: cs2[3].mix(bg, 1 - r2), cc_s: cs2[3].mix(bg, r2), cc: cs2[3], cc_h: cs2[3].mix(wt, r1),
        cb_d: cs2[4].mix(bg, 1 - r2), cb_s: cs2[4].mix(bg, r2), cb: cs2[4], cb_h: cs2[4].mix(wt, r1),
        cm_d: cs2[5].mix(bg, 1 - r2), cm_s: cs2[5].mix(bg, r2), cm: cs2[5], cm_h: cs2[5].mix(wt, r1),

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
}
export type NamedColors = ReturnType<typeof getNamedColors>;