<template>
<n-input v-model:value="localValue" size="small" >
    <template #suffix>
        <Draggable :relative="true" :cb="handleDrag">
            <n-icon color="#000000"><swap-vert-round/></n-icon>
        </Draggable>
    </template>
</n-input>
</template>
<script setup lang="ts">
import { SwapVertRound } from '@vicons/material';
import { ref, watch } from 'vue';
import type { DragEvent } from './Draggable.vue';
const props = defineProps<{
    min: number,
    max: number,
    value: number,
}>();

const emit = defineEmits(['value']);
const localValue = ref(props.value);

watch(() => props.value, () => {
    localValue.value = props.value;
    emit('value', localValue.value);
});

const MAX = -5;
const MIN = 5;
function handleDrag(e: DragEvent) {
    const value = (e.y - MIN) / (MAX-MIN) * (props.max - props.min) + props.min;
    emit('value', localValue.value);
}
watch(() => localValue.value, () => {
    if(isNaN(Number(localValue.value))) {
        return;
    }
    emit('value', localValue.value);
});
</script>
