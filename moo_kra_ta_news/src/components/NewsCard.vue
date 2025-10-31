<script setup lang="ts">
import DeleteButton from '@/components/DeleteButton.vue'
import DeleteConfirmation from '@/components/DeleteConfirmation.vue'
import StatusCard from '@/components/home-page/StatusCard.vue'
import { useAuthStore } from '@/stores/auth'
import { type News } from '@/types'
import { formatDate } from '@/utils/dateFormatter'
import { getUserProfile } from '@/utils/userProfile'
import { computed, ref } from 'vue'

const authStore = useAuthStore()

const props = defineProps<{
  news: News
  showDeleteButton: boolean 
}>()

// Debug: Log the news data
console.log('NewsCard received news:', props.news)

const userProfile = computed(() => getUserProfile(props.news.reporter || ''))

const realComments = computed(() => {
  return props.news.comments?.filter((comment) => comment.vote === 'Real').length || 0
})

const fakeComments = computed(() => {
  return props.news.comments?.filter((comment) => comment.vote === 'Fake').length || 0
})

const imageSrc = computed(() => {
  const img = props.news.imageUrl
  if (Array.isArray(img)) return img[0] ?? ''
  if (typeof img === 'string') return img
  return ''
})

const emit = defineEmits<{
  deleteNews: [id: number]
}>()

const deleteNews = (event?: Event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  showDeleteModal.value = true
}

const handleConfirmDelete = () => {
  emit('deleteNews', props.news.id)
  showDeleteModal.value = false
}
const handleCancelDelete = () => {
  showDeleteModal.value = false
}

const showDeleteModal = ref(false)
console.log('User roles:', authStore.user?.roles)
console.log('Is Admin:', authStore.isAdmin)
</script>

<template>
  <div class="relative">
    <div class="absolute top-2 right-2 z-10">
      <DeleteButton v-if="authStore.isAdmin && showDeleteButton"
        @confirm="deleteNews" 
        :show-text="false" 
        size="sm" 
        title="Delete news" 
      />
    </div>

    <RouterLink :to="{ name: 'news-detail-view', params: { id: news.id } }">
      <div class="cursor-pointer flex flex-col w-full gap-3.5 hover:scale-101">
        <div class="relative">
          <img
            v-if="news.imageUrl"
            :src="news.imageUrl"
            alt="News Image"
            class="w-full h-72 object-cover rounded-xl mb-2"
          />
          <StatusCard
            :isReal="realComments > fakeComments"
            :text="realComments > fakeComments ? 'Trusted' : 'Fake'"
          />
        </div>

        <div class="text-neutral-600 flex items-center gap-2">
          <div
            :class="[
              userProfile.bgColor,
              'rounded-full w-6 h-6 flex items-center justify-center text-white',
            ]"
          >
            {{ userProfile.initials }}
          </div>
          <span class="text-sm">{{ news.reporter }} • </span>
          <span class="text-sm">{{ formatDate(news.reportDate) }}</span>
        </div>

        <h2 class="font-sumana font-semibold tracking-tight text-2xl">{{ news.topic }}</h2>
        <span class="text-neutral-600 text-sm">{{ news.shortDetail }}</span>
      </div>
    </RouterLink>

    <DeleteConfirmation
      :is-open="showDeleteModal"
      topic-type="news"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>
