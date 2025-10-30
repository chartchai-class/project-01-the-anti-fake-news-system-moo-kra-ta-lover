<script setup lang="ts">
interface Props {
  message: string
  type?: 'success' | 'error'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  duration: 3000
})

const emit = defineEmits<{
  close: []
}>()

setTimeout(() => {
  emit('close')
}, props.duration)

const onClose = () => {
  emit('close')
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-in slide-in-from-right duration-300"
       :class="type === 'success' ? 'bg-green-500' : 'bg-red-500'">
    <div class="flex items-center gap-3">
      <span>{{ message }}</span>
      <button 
        @click="onClose"
        class="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-in {
  animation-duration: 0.3s;
  animation-timing-function: ease-out;
}

.slide-in-from-right {
  animation-name: slideInFromRight;
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>