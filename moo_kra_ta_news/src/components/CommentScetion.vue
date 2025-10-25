<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NewsService from '@/services/NewsService'
import BaseInput from './BaseInput.vue'
import type { News } from '@/types' // Make sure to import

const route = useRoute()
const router = useRouter()
const newsId = Number(route.params.id)

// Fix: Add proper type
const news = ref<News | null>(null)
const isLoading = ref(false)

type VoteType = 'Real' | 'Fake'

const comment = ref({
  user: '',
  vote: 'Real' as VoteType,
  comment: '',
  imageUrls: [] as string[],
})

// Fetch news
onMounted(() => {
  NewsService.getNewsById(newsId)
    .then((response) => {
      news.value = response.data
    })
    .catch((error) => {
      console.error('Failed to fetch news:', error)
      router.push({ name: 'network-error-view' })
    })
})

// Save comment
function saveComment() {
  if (!comment.value.user.trim()) return showAlert('⚠️ Please enter your name.')
  if (!comment.value.comment.trim()) return showAlert('⚠️ Please write a comment.')
  isLoading.value = true

  NewsService.saveComment(newsId, comment.value)
    .then((response) => {
      // Fix: Check if news exists and has comments
      if (news.value) {
        news.value.comments.push(response.data)
      }

      // Reset form
      comment.value = {
        user: '',
        vote: 'Real' as VoteType,
        comment: '',
        imageUrls: [],
      }
      showAlert('✅ Comment posted!')
    })
    .catch((error) => {
      console.error('Failed to save comment:', error)
      router.push({ name: 'network-error-view' })
    })
    .finally(() => {
      isLoading.value = false
    })
}

// For single image URL input
const singleImageUrl = computed({
  get() {
    return comment.value.imageUrls[0] || ''
  },
  set(value: string) {
    comment.value.imageUrls = value ? [value] : []
  },
})

const alertMessage = ref('')

function showAlert(message: string) {
  alertMessage.value = message
  setTimeout(() => (alertMessage.value = ''), 3000)
}

const totalComments = computed(() => {
  return news.value?.comments?.length || 0
})

const realVotes = computed(() => {
  return news.value?.comments?.filter(comment => comment.vote === 'Real').length || 0
})

const fakeVotes = computed(() => {
  return news.value?.comments?.filter(comment => comment.vote === 'Fake').length || 0
})

</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="alertMessage" class="mb-4 p-3 rounded-lg bg-red-100 text-red-700 font-medium">
      {{ alertMessage }}
    </div>

    <div class="mb-4 p-4 bg-white border rounded-lg shadow-sm">
      <h3 class="font-semibold text-lg mb-2">Comment Statistics</h3>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ totalComments }}</div>
          <div class="text-sm text-gray-600">Total Comments</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600">{{ realVotes }}</div>
          <div class="text-sm text-gray-600">Real Votes</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-red-600">{{ fakeVotes }}</div>
          <div class="text-sm text-gray-600">Fake Votes</div>
        </div>
      </div>
    </div>

    <form @submit.prevent="saveComment" class="space-y-3">
      <BaseInput v-model="comment.user" label="Your Name" placeholder="Enter your name" />

      <div class="flex gap-4">
        <button
          type="button"
          @click="comment.vote = 'Real'"
          :class="comment.vote === 'Real' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'"
          class="flex-1 py-2 rounded-md"
        >
          Real
        </button>
        <button
          type="button"
          @click="comment.vote = 'Fake'"
          :class="comment.vote === 'Fake' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'"
          class="flex-1 py-2 rounded-md"
        >
          Fake
        </button>
      </div>

      <BaseInput v-model="comment.comment" label="Comment" placeholder="Write your comment" />

      <BaseInput v-model="singleImageUrl" label="Image URL (optional)" placeholder="https://..." />

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-600 text-white py-2 rounded-md disabled:bg-gray-400"
      >
        {{ isLoading ? 'Posting...' : 'Post Comment' }}
      </button>
    </form>
  </div>
</template>
