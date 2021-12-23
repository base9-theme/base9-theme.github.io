import Color from 'color';
import { PRIORITY_BELOW_NORMAL, SSL_OP_PKCS1_CHECK_1 } from 'constants';
import _ from 'lodash';
import Mustache from 'mustache';

// a = "asd",)]
// asdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
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
    const c = [0,0,0,0,0,0,0];
    const A = [0,1,2,3,4,5,6];
    f(A);
    
    const n = 7;
    let tmp = 0;
    let i = 0;
    while(i < n){
        if(c[i] < i) {
            const swapI = (i%2)===0 ? 0 : c[i];
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
    Color("#FF0000"),
    Color("#FFFF00"),
    Color("#00FF00"),
    Color("#00FFFF"),
    Color("#0000FF"),
    Color("#FF00FF"),
];

function getTrueColorOrder(colors: Color[]) {
    let min = Infinity;
    let minOrder: number[] = [];
    iteratePermutations(order => {
        const diff =
            difference(colors[order[0]], hues[0]) +
            difference(colors[order[1]], hues[1]) +
            difference(colors[order[2]], hues[2]) +
            difference(colors[order[3]], hues[3]) +
            difference(colors[order[4]], hues[4]) +
            difference(colors[order[5]], hues[5]);
        if(min > diff) {
            min = diff;
            minOrder = order.slice();
        }
    });
    return minOrder;
}


export function getNamedColors(palette: Color[], mapping: {[k: string]: string}, r1: number = 0.5, r2: number = 0.25): { [k: string]: Color } {
    const background = palette[0];
    const foreground = palette[1];
    const colors = palette.slice(2);
    const order =  getTrueColorOrder(colors);
    const m = new Map<string, Color>();

    function setColor(key: string, c: Color) {
        m.set(`${key}`, c);
        m.set(`${key}_b`, c.mix(background, 1-r2));
        m.set(`${key}_m`, c.mix(background, r1));
        m.set(`${key}_s`, c.mix(background, r2));
        m.set(`${key}_h`, c.mix(foreground, r1));
    }
    setColor("c1", colors[0]);
    setColor("c2", colors[1]);
    setColor("c3", colors[2]);
    setColor("c4", colors[3]);
    setColor("c5", colors[4]);
    setColor("c6", colors[5]);
    setColor("c7", colors[6]);

    setColor("red",     colors[order[0]]);
    setColor("yellow",  colors[order[1]]);
    setColor("green",   colors[order[2]]);
    setColor("cyan",    colors[order[3]]);
    setColor("blue",    colors[order[4]]);
    setColor("magenta", colors[order[5]]);
    
    m.set("background", background);
    m.set("background_s", foreground.mix(background, 1-r2/4));
    m.set("background_ss", foreground.mix(background, 1-r2));
    m.set("foreground", foreground);
    m.set("foreground_s", foreground.mix(background, r2));
    m.set("foreground_ss", foreground.mix(background, r1));

    
    m.set("todo_template_0", Color("#FFFFFF")); //white
    m.set("todo_template_1", Color("#FF0000")); //red
    m.set("todo_template_2", Color("#FFFF00")); //yellow
    m.set("todo_template_3", Color("#00FF00")); //green
    m.set("todo_template_4", Color("#00FFFF")); //cyan
    m.set("todo_template_5", Color("#0000FF")); //blue
    m.set("todo_template_6", Color("#FF00FF")); //magenta
    m.set("todo_template_7", Color("#FF8000")); //orange
    m.set("todo_template_8", Color("#000000")); //black
    m.set("todo_template_9", Color("#808080")); //gray

    m.set("d_TEMP_QUOTES", Color("#E9F284"));
    m.set("d_TEMP_PROPERTY", Color("#8BE9FE"));
    m.set("d_LineHighlight", Color("#44475A"));


    function fill(obj: Map<string, string>, left: string, stop?: string): boolean {
        if(m.has(left)) {
            return true;
        }
        if(!obj.has(left)) {
            return false;
        }
        const right = obj.get(left)!;
        if(right === stop) {
            return false;
        }
        if(!fill(obj, right, stop)) {
            return false;
        }

        m.set(left, m.get(right)!);
        return true;
    }

    const m2 = new Map<string, string>();
    // const variations = ["_b", "", "_s", "_h"];
    const variations = ["", "_h", "_s", "_m", "_b"];
    _.each(mapping, (value,key) => {
        if(key.startsWith("$")) {
            const key2 = key.substring(1);
            _.each(variations, v => m2.set(key2+v, value+v));
        } else {
            m2.set(key,value);
        }
    });
    const todo_x = mapping.todo_template_x;
    _.times(500, i => {
        let i2 = i;
        let color = "todo";
        switch(todo_x) {
            case "bg":
                color = "bg";
                break;
            case "1":
                color = "todo_template_"+(i2%10);
                break;
            case "2":
                color = "todo_template_"+(((i2/10)|0)%10);
                break;
            case "3":
                color = "todo_template_"+((i2/100)|0);
                break;
        }
        m2.set("todo"+i, color);
    })

    _.each([...m2.entries()], ([key]) => {
        if(!fill(m2, key, key)) {
            console.log("fill fail: "+key);
        }
    });

    const rtn = Object.fromEntries(m);
    return rtn;
}
// export type NamedColors = ReturnType<typeof getNamedColors>;
export type NamedColors = { [k: string]: Color };

export function getTemplateVariable(cs: NamedColors) {
    const rtn: [string, string][] = [];
    rtn.push(..._.flatMap(cs, (v: Color, k: string) => {
        return [
            [k, v.hex().toString()] as [string, string],
        ];
    }));
  const rtn2 = Object.fromEntries(rtn);
  return rtn2;
}
type Obj = { [k: string]: string };
export function render(template: string, cs: Color[], semantic: Obj) {
    const namedColors = getNamedColors(cs, semantic);
    const view = getTemplateVariable(namedColors);
    return Mustache.render(template, view)
}
