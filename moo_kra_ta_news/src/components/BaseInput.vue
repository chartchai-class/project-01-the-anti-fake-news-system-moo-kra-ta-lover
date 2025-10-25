<script setup lang="ts">
const modelValue = defineModel()
interface BaseInputProps {
    label: string
}
const props = withDefaults(defineProps<BaseInputProps>(), {
    label: ""
})
</script>

<template>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
        {{ props.label }}
    </label>
    <input class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" v-bind="$attrs" v-model="modelValue" :placeholder="label">
</template>