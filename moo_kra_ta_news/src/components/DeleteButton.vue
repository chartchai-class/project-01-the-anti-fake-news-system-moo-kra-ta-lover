<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  title?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  disabled?: boolean
  confirmMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Delete',
  title: 'Delete',
  size: 'md',
  showText: true,
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  confirm: []
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-6 px-2 text-xs'
    case 'lg': return 'h-10 px-4 text-base'
    default: return 'h-7 px-3 sm:h-9 sm:px-4 text-xs sm:text-sm'
  }
})

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit('click', event)
  emit('confirm')
}
</script>
<template>
  <button
    @click="handleClick"
    :class="[
      'group relative h-7 px-3 sm:h-9 sm:px-4 bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95',
      sizeClasses,
      disabled && 'opacity-50 cursor-not-allowed hover:bg-white hover:text-red-500'
    ]"
    :title="title"
    :disabled="disabled"
  >
    <div class="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="currentColor"
        :class="[
          'bi bi-trash transition-transform duration-300',
          !disabled && 'group-hover:scale-110 group-hover:rotate-12'
        ]"
        viewBox="0 0 16 16"
      >
        <path
          d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
        />
        <path
          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
        />
      </svg>
    </div>
    <span v-if="showText" class="hidden sm:inline font-medium transition-colors duration-300">
      {{ label }}
    </span>
  </button>
</template>

