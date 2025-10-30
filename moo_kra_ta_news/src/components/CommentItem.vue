<script setup lang="ts">
import DeleteButton from '@/components/DeleteButton.vue'
import DeleteConfirmation from '@/components/DeleteConfirmation.vue'
import { useAuthStore } from '@/stores/auth'
import type { Comment } from '@/types'
import { getUserProfile } from '@/utils/userProfile'
import { Check, TriangleAlert } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const props = defineProps<{
  comment: Comment
  showDeleteButton: boolean 
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

const authStore = useAuthStore()
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
          <DeleteButton v-if="authStore.isAdmin && showDeleteButton"
            @confirm="deleteComment"
            size="sm"
            title="Delete comment"
          />
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
      topic-type="comment"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>
