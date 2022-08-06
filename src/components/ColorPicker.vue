<template>
<div className="container">
        <Draggable
            :style="{
                position: 'relative',
                height: '250px',
                backgroundSize: '100%',
                backgroundImage: `url(${canvasUrl})`
            }"
            :cb="handleDrag"
            :clamp="true"
        >
            <span
                className="color-circle color-circle-selected"
                :style="circleStyle(setting.tmpColor ?? colors[setting.selected])"
            ></span>
            <template v-if="setting.flags.includes('compare')">
                <template v-for="(c, i) in colors" v-bind:key="i">
                    <span
                        v-if="i !== setting.selected"
                        className="color-circle"
                        :style="circleStyle(c)"
                    ></span>
                </template>
            </template>
        </Draggable>
        <Draggable
            :style="{
                position: 'relative',
                height: '10px',
                backgroundSize: '100%',
                backgroundImage: `url(${canvasUrl2})`
            }"
            :cb="handleDrag2"
            :clamp="true"
        >
            <span
                className="color-circle color-circle-selected"
                :style="circleStyle2(setting.tmpColor ?? colors[setting.selected])"
            ></span>
            <template v-if="setting.flags.includes('compare')">
                <template v-for="(c, i) in colors" v-bind:key="i">
                    <span
                        v-if="i !== setting.selected"
                        className="color-circle"
                        :style="circleStyle2(c)"
                    ></span>
                </template>
            </template>
        </Draggable>
    <div :style="{display: 'flex'}">
        <n-button v-on:click="nextColorSpace" size="small" quaternary :style="{width: '50px', marginRight: '5px'}">{{colorSpace.label}}</n-button>
        <DragInputNumber :min="0" :max="100" v-model:value="setting.tmpNumber"/>
        <n-input size="small" >
            <template #suffix>
                <n-icon color="#000000"><swap-vert-round/></n-icon>
            </template>
        </n-input>
        <n-input size="small" >
            <template #suffix>
                <n-icon color="#000000"><swap-vert-round/></n-icon>
            </template>
        </n-input>
    </div>
    <div :style="{display: 'flex'}">
        <n-popselect v-model:value="setting.flags" multiple :options="popSelectOptions">
            <n-button size="small" quaternary :style="{width: '50px', marginRight: '5px'}" #icon><menu-round/></n-button>
        </n-popselect>
        <n-input size="small" >
            <template #suffix>
                <n-icon color="#000000"><content-copy-sharp/></n-icon>
            </template>
        </n-input>
    </div>
</div>
<div :style="{display: 'flex', width: '500px'}">
    <n-form
        ref="formRef"
        label-placement="left"
        require-mark-placement="right-hanging"
        :style="{width: '140px', float: 'left'}"
        size="small"
        label-width="50"
    >
        <n-form-item label="Space">
        <n-select
            v-model:value="setting.space"
            :options="options"
        />
        </n-form-item>
        <n-form-item label="Compare">
        <n-switch v-model:value="setting.showOthers"/>
        </n-form-item>
        <n-form-item :label="colorSpace.componentLabels[0]">
        <n-input :value="selectedComponents[0].toFixed(0)"></n-input>
        </n-form-item>
        <n-form-item :label="colorSpace.componentLabels[1]">
        <n-input :value="selectedComponents[1].toFixed(0)"></n-input>
        </n-form-item>
        <n-form-item :label="colorSpace.componentLabels[2]">
        <n-input :value="selectedComponents[2].toFixed(0)"></n-input>
        </n-form-item>
    </n-form>
    <div>
    </div>
</div>
</template>
<style scoped>
.container {
    width: 250px;
    margin-bottom: 20px;
}
.container > div {
    display: flex;
    margin-bottom: 5px;
}
.color-circle {
    transform: translate(-50%, -50%);
    position: absolute;
    user-select: none;
    text-align: center;
    width: 12px;
    height: 12px;
    border: 1px solid #fff;
    border-radius: 6px;
}
.color-circle-selected {
    z-index: 10;
    border-width: 2px;
}
</style>
<script setup lang="ts">
import { SwapVertRound, ContentCopySharp, MenuRound } from '@vicons/material';
import Color from "color";
import _ from "lodash";
import * as convert from 'color-convert';
import { computed, CSSProperties, inject, Ref, ref, watch, watchPostEffect } from "vue";
import { ColorPalette } from "../helpers";
(window as any).convert = convert;
(window as any).Color = Color;

type Number3 = [number, number, number];

type ColorSpace = {
    readonly label: string,
    readonly componentLabels: [string, string, string],
    toComponents: (c: Color) => Number3,
    fromComponents: (components: Number3) => Color,
    preview: {
        xyzToColor: (xyz: Number3) => Color,
        colorToXyz: (c: Color) => Number3,
    }
}

const popSelectOptions = [
    { label: "compare", value: "compare" },
    { label: "region", value: "region" },
]

const colorSpaces = [
    {
        label: "RGB",
        componentLabels: ['R', 'G', 'B'],
        toComponents: (c: Color) => {
            return c.rgb().array() as Number3;
        },
        fromComponents: (components: Number3) => {
            return Color.rgb(components);
        },
        preview: {
            xyzToColor(xyz: Number3): Color {
                const comp = [xyz[2]*360, xyz[0]*100, xyz[1]*100];
                return Color.hsv(comp);
            },
            colorToXyz(c: Color) {
                let [h,s,v] = c.hsv().array();
                return [s/100, v/100, h/360];
            }
        }
    } as ColorSpace,
    {
        label: "Lab",
        componentLabels: ['L', 'a', 'b'],
        toComponents: (c: Color) => {
            return c.lab().array() as Number3;
        },
        fromComponents: (components: Number3) => {
            return Color.lab(components);
        },
        preview: {
            xyzToColor(xyz: Number3): Color {
                const comp = [xyz[1]*100, xyz[0]*133, xyz[2]*360];
                return Color.lch(comp);
            },
            colorToXyz(color: Color) {
                let [l,c,h] = color.lch().array();
                return [c/133, l/100, h/360];
            }
        }
    } as ColorSpace,
    {
        label: "Lch",
        componentLabels: ['L', 'c', 'h'],
        toComponents: (c: Color) => {
            return c.lch().array() as Number3;
        },
        fromComponents: (components: Number3) => {
            return Color.lch(components);
        },
        preview: {
            xyzToColor(xyz: Number3): Color {
                const comp = [xyz[2]*100, xyz[0]*256-128, xyz[1]*256-128];
                return Color.lab(comp);
            },
            colorToXyz(c: Color) {
                let [l,a,b] = c.lab().array();
                return [a/256 + 0.5, b/256 + 0.5, l/100];
            }
        }
    } as ColorSpace,
] as const;

const options = _.entries(colorSpaces).map(([k, v]) => ({
    label: v.label,
    value: k,
  }));

function nextColorSpace() {
    setting.value.space = (setting.value.space + 1) % colorSpaces.length;
}

const colorSpace = computed(() => colorSpaces[setting.value.space]);
const selectedColor = computed(() => colors.value[setting.value.selected]);
const selectedComponents = computed(() => colorSpace.value.toComponents(setting.value.tmpColor ?? selectedColor.value));
type ColorSpaceName = keyof typeof colorSpaces;

const colors = inject('colors') as Ref<ColorPalette>;
const handleDrag = (e: DragEvent) => {
    const oldXyz = colorSpace.value.preview.colorToXyz(selectedColor.value);
    let newColor = colorSpace.value.preview.xyzToColor([e.x, e.y, oldXyz[2]]);

    if(e.type === 'end') {
        colors.value[setting.value.selected] = newColor;
        setting.value.tmpColor = undefined;
    } else {
        setting.value.tmpColor = newColor;
    }
}

const handleDrag2 = (e: DragEvent) => {
    const oldXyz = colorSpace.value.preview.colorToXyz(selectedColor.value);
    let newColor = colorSpace.value.preview.xyzToColor([oldXyz[0], oldXyz[1], e.x]);

    if(e.type === 'end') {
        colors.value[setting.value.selected] = newColor;
        setting.value.tmpColor = undefined;
    } else {
        setting.value.tmpColor = newColor;
    }
}

const setting = ref({
    selected: 2,
    tmpColor: undefined as undefined|Color,
    space: 0,
    fixed: '0' as '0'|'1'|'2',
    flags: [] as string[],
    showOthers: true,
    tmpNumber: 0,
});
const w = 200;
const h = 200;

function paintPixel(img: ImageData, x: number, y: number, c: Color) {
    const index = 4 * (y*w + x);
    img.data[index + 0] = c.red();
    img.data[index + 1] = c.green();
    img.data[index + 2] = c.blue();
    img.data[index + 3] = 255;
}

function circleStyle(c: Color): CSSProperties {
    return {
        top: `${colorSpace.value.preview.colorToXyz(c)[1]*100}%`,
        left: `${colorSpace.value.preview.colorToXyz(c)[0]*100}%`,
        background: c.hex(),
    }
}

function circleStyle2(c: Color): CSSProperties {
    return {
        top: `50%`,
        left: `${colorSpace.value.preview.colorToXyz(c)[2]*100}%`,
        background: c.hex(),
    }
}

function xyzDistance(xyz1: Number3, xyz2: Number3) {
    return Math.hypot(xyz1[0] - xyz2[0], xyz1[1] - xyz2[1], xyz1[2] - xyz2[2]);
}

const canvasUrl = computed(() => {
    const showRegion = setting.value.flags.includes('region');
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d")!;
    const img = ctx.createImageData(w,h);
    const oldXyz = colorSpace.value.preview.colorToXyz(selectedColor.value);
    for(let xi = 0; xi < w; xi++) {
        for(let yi = 0; yi < h; yi++) {
            const xyz = [xi/w, yi/h, oldXyz[2]] as Number3;
            let color = colorSpace.value.preview.xyzToColor(xyz).rgb();
            const testXyz = colorSpace.value.preview.colorToXyz(color);
            if(showRegion && xyzDistance(xyz, testXyz) > 0.01) {
                // color = color.darken(0.1);
                color = Color.rgb(_.map(color.rgb().array(), x => x*0.7))
            }
            paintPixel(img, xi, yi, color);
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL();
});
const canvasUrl2 = computed(() => {
    const showRegion = setting.value.flags.includes('region');
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    const img = ctx.createImageData(w,h);
    const oldXyz = colorSpace.value.preview.colorToXyz(selectedColor.value);
    for(let xi = 0; xi < w; xi++) {
        const xyz = [oldXyz[0], oldXyz[1], xi/w] as Number3;
        let color = colorSpace.value.preview.xyzToColor(xyz).rgb();
        const testXyz = colorSpace.value.preview.colorToXyz(color);
        if(showRegion && xyzDistance(xyz, testXyz) > 0.01) {
            color = Color.rgb(_.map(color.rgb().array(), x => x*0.7))
        }
        paintPixel(img, xi, 0, color);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL();
});
</script>