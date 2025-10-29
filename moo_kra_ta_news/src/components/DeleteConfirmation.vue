<script setup lang="ts">
interface Props {
  isOpen: boolean
  topicType?: string 
}

const { isOpen, topicType = 'comment' } = defineProps<Props>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const onConfirm = () => emit('confirm')
const onCancel = () => emit('cancel')
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
      <div class="flex justify-center mb-4">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
      </div>

      <h3 class="text-lg font-semibold text-center text-gray-900 mb-2">Delete {{ topicType }}?</h3>
      <p class="text-gray-600 text-center mb-6">
        Are you sure you want to delete this {{ topicType }}?
      </p>

      <!-- Buttons -->
      <div class="flex gap-3">
        <button
          @click="onCancel"
          class="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          @click="onConfirm"
          class="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
