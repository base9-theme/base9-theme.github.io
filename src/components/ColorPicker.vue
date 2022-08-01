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
    </n-layout-sider>
    <n-layout-content content-style="padding: 24px;">
        <!-- <div :style="{margin: '10px'}"></div> -->
        <Draggable
            :style="{
                position: 'relative',
                width: '500px',
                height: '500px',
                backgroundSize: '100%',
                backgroundImage: `url(${canvasUrl})`
            }"
            :cb="handleDrag"
        >
            <span
                className="color-circle color-circle-selected"
                :style="circleStyle(setting.tmpColor ?? colors[setting.selected])"
            ></span>
            <template v-if="setting.showOthers">
                <template v-for="(c, i) in colors" v-bind:key="i">
                    <span
                        v-if="i !== setting.selected"
                        className="color-circle"
                        :style="circleStyle(c)"
                    >{{i + 1}}</span>
                </template>
            </template>
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
    "lab": {
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
    "lch": {
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
} as const;

const options = _.entries(colorSpaces).map(([k, v]) => ({
    label: v.label,
    value: k,
  }));

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

const setting = ref({
    selected: 2,
    tmpColor: undefined as undefined|Color,
    space: 'rgb' as ColorSpaceName,
    fixed: '0' as '0'|'1'|'2',
    polar: false,
    showOthers: true,
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

function xyzDistance(xyz1: Number3, xyz2: Number3) {
    return Math.hypot(xyz1[0] - xyz2[0], xyz1[1] - xyz2[1], xyz1[2] - xyz2[2]);
}

const canvasUrl = computed(() => {
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
            if(xyzDistance(xyz, testXyz) > 0.01) {
                // color = color.darken(0.1);
                color = Color.rgb(_.map(color.rgb().array(), x => x*0.9))
            }
            paintPixel(img, xi, yi, color);
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL();
});
</script>