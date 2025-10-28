<script setup lang="ts">
import type { Comment } from '@/types'
import { getUserProfile } from '@/utils/userProfile'
import { Check, TriangleAlert } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import DeleteConfirmation from '@/components/DeleteConfirmation.vue'

const props = defineProps<{
  comment: Comment
}>()

const emit = defineEmits<{
  deleteComment: [id: number]
}>()

const userProfile = computed(() => getUserProfile(props.comment.user || ''))

const showDeleteModal = ref(false)

const deleteComment = () => {
  showDeleteModal.value = true
}

const handleConfirmDelete = () => {
  emit('deleteComment', props.comment.id)
  showDeleteModal.value = false
}

const handleCancelDelete = () => {
  showDeleteModal.value = false
}
</script>

<template>
  <div>
    <div
      class="border border-grey-600 bg-[#F5F5F5] p-3 sm:p-4 mb-4 sm:mb-6 hover:scale-101 hover:shadow-sp w-full rounded-lg transition-all duration-200"
    >
      <div class="flex items-center justify-between font-inter">
        <div class="flex items-center gap-2 font-inter">
          <div
            :class="[
              userProfile.bgColor,
              'rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-xl text-white',
            ]"
          >
            {{ userProfile.initials }}
          </div>
          <span class="text-sm sm:text-base">{{ comment.user }}</span>
        </div>

        <div class="flex items-center gap-2">
          <div
            class="h-6 w-16 sm:h-8 sm:w-24 rounded-full flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
            :class="comment.vote === 'Real' ? 'bg-[#E8F5EC]' : 'bg-[#F5E8E8]'"
          >
            <div
              v-if="comment.vote === 'Real'"
              class="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center"
            >
              <Check />
            </div>
            <div
              v-if="comment.vote === 'Fake'"
              class="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center"
            >
              <TriangleAlert />
            </div>
            <span
              class="flex items-center"
              :class="comment.vote === 'Real' ? 'text-[#2E9B40]' : 'text-[#9B2E30]'"
            >
              {{ comment.vote }}
            </span>
          </div>

          <!-- Delete Button -->
          <button
            @click="deleteComment"
            class="group relative h-7 px-3 sm:h-9 sm:px-4 bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95"
            title="Delete comment"
          >
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                class="bi bi-trash transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
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
            <span class="hidden sm:inline font-medium transition-colors duration-300">Delete</span>
          </button>
        </div>
      </div>

      <div
        v-if="comment.imageUrls && comment.imageUrls.length > 0"
        class="mt-3 sm:mt-6 flex flex-wrap gap-2 sm:gap-4"
      >
        <div
          v-for="(image, index) in comment.imageUrls"
          :key="index"
          class="w-32 h-32 sm:w-48 sm:h-48 rounded-xl overflow-hidden items-center justify-center mb-2 sm:mb-4 flex"
        >
          <img :src="image" :alt="`Comment Image ${index}`" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Comment Text -->
      <div class="mt-3 sm:mt-6 font-inter text-sm sm:text-lg">
        {{ comment.comment }}
      </div>
    </div>

    <!-- Delete Confirmation -->
    <DeleteConfirmation
      :is-open="showDeleteModal"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>
