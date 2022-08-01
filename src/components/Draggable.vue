
<template>
    <div ref="divRef" v-on:mousedown.left="handleMouseDown" >
        <slot/>
    </div>
</template>
<script setup lang="ts">
export interface DragEvent {x: number, y: number, type: 'begin'|'drag'|'end'};

import { on, off } from "evtd";
import _ from "lodash";
import { ref } from "vue";
const divRef = ref<HTMLDivElement|null>(null)

const props = defineProps<{
    cb: (e: DragEvent) => void
}>();
function handleMouseDown(e: MouseEvent) {
    if (!divRef.value) return;
    on('mousemove', document, handleMouseMove);
    on('mouseup', document, handleMouseUp);
    handleMouseMove(e);
}

function getType(e: MouseEvent) {
    if(e.type === 'mousedown' && e.button === 0) {
        return 'begin';
    }
    if(e.type === 'mousemove') {
        return 'drag';
    }
    if(e.type === 'mouseup' && e.button === 0) {
        return 'end';
    }
    return undefined;
}

function handleMouseMove(e: MouseEvent) {
      const { width, left, height, top } = divRef.value!.getBoundingClientRect()
      const type = getType(e);
      if(type) {
        props.cb({
            x: _.clamp((e.clientX - left)/width, 0, 1),
            y: _.clamp((e.clientY - top)/height, 0, 1),
            type: type,
        });
      }
}
function handleMouseUp(e: MouseEvent) {
    off('mousemove', document, handleMouseMove)
    off('mouseup', document, handleMouseUp)
    handleMouseMove(e);
}
</script>