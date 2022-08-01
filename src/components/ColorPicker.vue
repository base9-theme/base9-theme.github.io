<template>
<n-layout has-sider sider-placement="right">
    <n-layout-sider>
        <n-form
            ref="formRef"
            label-placement="left"
            require-mark-placement="right-hanging"
            size="small"
            label-width="auto"
        >
            <!-- <n-form-item label="Fixed:">
            <n-radio-group v-model:value="setting.fixed" name="radiogroup2">
                <n-radio-button value="0">
                    {{colorSpace.componentLabels[0]}}
                </n-radio-button>
                <n-radio-button value="1">
                    {{colorSpace.componentLabels[1]}}
                </n-radio-button>
                <n-radio-button value="2">
                    {{colorSpace.componentLabels[2]}}
                </n-radio-button>
            </n-radio-group>
            </n-form-item> -->
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
            <n-input v-model="selectedComponents[0]"></n-input>
            </n-form-item>
            <n-form-item :label="colorSpace.componentLabels[1]">
            <n-input v-model="selectedComponents[1]"></n-input>
            </n-form-item>
            <n-form-item :label="colorSpace.componentLabels[2]">
            <n-input v-model="selectedComponents[2]"></n-input>
            </n-form-item>
        </n-form>
    </n-layout-sider>
    <n-layout-content content-style="padding: 24px;">
        <!-- <div :style="{margin: '10px'}"></div> -->
        <Draggable
            :style="{position: 'relative', width: '200px', height: '200px'}"
            :cb="handleDrag"
        >
            <span
                className="color-circle color-circle-selected"
                :style="circleStyle(colors[setting.selected])"
            ></span>
            <template v-if="setting.showOthers">
                <template v-for="(c, i) in colors" v-bind:key="i">
                    <span
                        v-if="i !== setting.selected"
                        className="color-circle"
                        :style="circleStyle(c)"
                    >{{i}}</span>
                </template>
            </template>
            <canvas id="canvas2" width="200" height="200"></canvas>
        </Draggable>
    </n-layout-content>
</n-layout>
</template>
<style scoped>
.color-circle {
    transform: translate(-50%, -50%);
    position: absolute;
    width: 20px;
    user-select: none;
    text-align: center;
    height: 20px;
    border: 1px solid #000;
    border-radius: 10px;
}
.color-circle-selected {
    z-index: 10;
    border-width: 3px;
}
</style>
<script setup lang="ts">
import { off, on } from 'evtd'
import Color from "color";
import _ from "lodash";
import * as convert from 'color-convert';
import { computed, CSSProperties, inject, Ref, ref, watch, watchPostEffect } from "vue";
import { ColorPalette } from "../helpers";
(window as any).convert = convert;
(window as any).Color = Color;

const divRef = ref<HTMLDivElement|null>(null)

type ColorSpace = {
    readonly label: string,
    readonly componentLabels: [string, string, string],
    toComponents: (c: Color) => [number, number, number],
    fromComponents: (components: [number, number, number]) => Color,
    preview: {
        xYtoColor: (c: Color, x: number, y: number) => Color,
        zToColor: (c: Color, z: number) => Color,
        colorToXyz: (c: Color) => [number, number, number],
    }
}
function handleMouseDown(e: MouseEvent) {
    if (!divRef.value) return;
    on('mousemove', document, handleMouseMove);
    on('mouseup', document, handleMouseUp);
    handleMouseMove(e);
}

function handleMouseMove(e: MouseEvent) {
      const { width, left, height, top } = divRef.value!.getBoundingClientRect()
      console.log((e.clientX - left)/width, (e.clientY - top)/height);
}
function handleMouseUp(e: MouseEvent) {
    off('mousemove', document, handleMouseMove)
    off('mouseup', document, handleMouseUp)
}

const colorSpaces = {
    "rgb": {
        label: "RGB",
        componentLabels: ['R', 'G', 'B'],
        toComponents: (c: Color) => {
            return c.rgb().array() as [number, number, number];
        },
        fromComponents: (components: [number, number, number]) => {
            return Color.rgb(components);
        },
        preview: {
            xYtoColor(c: Color, x: number, y: number): Color {
                const comp = c.hsv().array();
                comp[1] = x*100;
                comp[2] = y*100;
                return Color.hsv(comp);
            },
            zToColor(c: Color, z: number) {
                return Color.hsv(z*360, 100, 100);
            },
            colorToXyz(c: Color) {
                let [h,s,v] = c.hsv().array();
                return [s/100, v/100, h/360];
            }
        }
    } as ColorSpace,
    "lab": {
        label: "Lab",
        componentLabels: ['L', 'a', 'b'],
        toComponents: (c: Color) => {
            return c.lab().array() as [number, number, number];
        },
        fromComponents: (components: [number, number, number]) => {
            return Color.lab(components);
        },
        preview: {
            xYtoColor(c: Color, x: number, y: number): Color {
                const comp = c.lch().array();
                comp[1] = x*133;
                comp[0] = y*100;
                return Color.lch(comp);
            },
            zToColor(c: Color, z: number) {
                const comp = c.lch().array();
                comp[2] = z*360;
                return Color.lab(comp);
            },
            colorToXyz(color: Color) {
                let [l,c,h] = color.lch().array();
                return [c/133, l/100, h/360];
            }
        }
    } as ColorSpace,
    "lch": {
        label: "Lch",
        componentLabels: ['L', 'c', 'h'],
        toComponents: (c: Color) => {
            return c.lch().array() as [number, number, number];
        },
        fromComponents: (components: [number, number, number]) => {
            return Color.lch(components);
        },
        preview: {
            xYtoColor(c: Color, x: number, y: number): Color {
                const comp = c.lab().array();
                comp[1] = (2*x-1)*128;
                comp[2] = (2*y-1)*128;
                return Color.lab(comp);
            },
            zToColor(c: Color, z: number) {
                const comp = c.lab().array();
                comp[0] = z*100;
                return Color.lab(comp);
            },
            colorToXyz(c: Color) {
                let [l,a,b] = c.lab().array();
                return [a/256 + 0.5, b/256 + 0.5, l/100];
            }
        }
    } as ColorSpace,
} as const;

const options = _.entries(colorSpaces).map(([k, v]) => ({
    label: v.label,
    value: k,
  }));

const colorSpace = computed(() => colorSpaces[setting.value.space]);
const selectedColor = computed(() => colors.value[setting.value.selected]);
const selectedComponents = computed(() => colorSpace.value.toComponents(selectedColor.value));
type ColorSpaceName = keyof typeof colorSpaces;

const colors = inject('colors') as Ref<ColorPalette>;
const tmpLog = console.log;
const handleDrag = (e: DragEvent) => {
    
    const newColor = colorSpace.value.preview.xYtoColor(selectedColor.value, e.x, e.y);
    colors.value[setting.value.selected] = newColor;
}

const setting = ref({
    selected: 2,
    tmpColor: undefined as undefined|[number, number, number],
    space: 'rgb' as ColorSpaceName,
    fixed: '0' as '0'|'1'|'2',
    polar: false,
    showOthers: true,
});
const w = 200;
const h = 200;

watch(() => setting.value.showOthers, () => {
    redraw();
})

function paintPixel(img: ImageData, x: number, y: number, c: Color) {
    const index = 4 * (y*w + x);
    img.data[index + 0] = c.red();
    img.data[index + 1] = c.green();
    img.data[index + 2] = c.blue();
    img.data[index + 3] = 255;
}

function circleStyle(c: Color): CSSProperties {
    return {
        top: `${colorSpace.value.preview.colorToXyz(c)[1]*200}px`,
        left: `${colorSpace.value.preview.colorToXyz(c)[0]*200}px`,
        background: c.hex(),
    }
}

interface Point {
    x: number,
    y: number,
}

// const colorLabel = ['Bg', 'Fg', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
const colorLabel = "BF1234567";

function getImageData() {
    const canvas = document.getElementById("canvas2") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const img = ctx.createImageData(w,h);
    for(let xi = 0; xi < w; xi++) {
        for(let yi = 0; yi < h; yi++) {
            paintPixel(img, xi, yi, colorSpace.value.preview.xYtoColor(selectedColor.value, xi/w, yi/h));
        }
    }
    return img;
}

function redraw() {
    console.log('redraw');
    const canvas = document.getElementById("canvas2") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const img = ctx.createImageData(w,h);
    for(let xi = 0; xi < w; xi++) {
        for(let yi = 0; yi < h; yi++) {
            paintPixel(img, xi, yi, colorSpace.value.preview.xYtoColor(selectedColor.value, xi/w, yi/h));
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(img, 0, 0);
}
</script>