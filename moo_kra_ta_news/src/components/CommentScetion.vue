<script lang="ts" setup>
import NewsService from '@/services/NewsService';
import { useAuthStore } from '@/stores/auth';
import { useNewsStore } from '@/stores/news';
import type { News } from '@/types';
import { useField, useForm } from 'vee-validate';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import BaseInput from './BaseInput.vue';
import CommentImageUpload from './CommentImageUpload.vue';

const route = useRoute()
const router = useRouter()
const newsId = Number(route.params.id)
const newsStore = useNewsStore()
const authStore = useAuthStore()

const news = ref<News | null>(null)
const isLoading = ref(false)
const alertMessage = ref('')

type VoteType = 'Real' | 'Fake'

// Validation schema
const validationSchema = yup.object({
  vote: yup.string().oneOf(['Real', 'Fake']).required('Vote is required'),
  comment: yup.string().required('Comment is required').min(1, 'Comment cannot be empty'),
  imageUrls: yup.array().of(yup.string())
})

// Setup form with vee-validate
const { errors, handleSubmit, resetForm } = useForm({
  validationSchema,
  initialValues: {
    vote: 'Real' as VoteType,
    comment: '',
    imageUrls: [] as string[]
  }
})

// Setup fields
const { value: vote } = useField<VoteType>('vote')
const { value: comment } = useField<string>('comment')
const { value: imageUrls } = useField<string[]>('imageUrls')

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

// Save comment with vee-validate
const onSubmit = handleSubmit((values) => {
  isLoading.value = true

  const commentData = {
    user: { id: authStore.user!.id },
    vote: values.vote,
    comment: values.comment,
    imageUrls: values.imageUrls
  }

  console.log('Sending comment', {
    newsId,
    comment: commentData
  })

  NewsService.saveComment(newsId, commentData)
    .then((response) => {
      if (news.value) {
        news.value.comments.push(response.data)
      }

      if (newsStore.news) {
        newsStore.news.comments.push(response.data)
      }

      // Reset form
      resetForm()
      showAlert('✅ Comment posted!')
      
      router.push({ 
        name: 'news-detail-view', 
        params: { id: newsId.toString() } 
      }).then(() => {
        window.location.reload()
      })
    })
    .catch((error) => {
      console.error('Failed to save comment:', error)
      showAlert('❌ Failed to post comment. Please try again.')
      // Optionally navigate to error page
      // router.push({ name: 'network-error-view' })
    })
    .finally(() => {
      isLoading.value = false
    })
})

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

// Fade animation for alerts
const showFade = ref(false)

watch(alertMessage, (newVal) => {
  if (newVal) {
    showFade.value = false
    setTimeout(() => {
      showFade.value = true
      setTimeout(() => {
        alertMessage.value = ''
        showFade.value = false
      }, 1000)
    }, 2000)
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="alertMessage" 
      :class="['mb-4 p-3 rounded-lg bg-red-100 text-red-700 font-medium', showFade ? 'animate-fadeOut' : 'animate-pop']">
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

    <form @submit.prevent="onSubmit" class="space-y-3">
      <div class="flex gap-4">
        <button
          type="button"
          @click="vote = 'Real'"
          :class="vote === 'Real' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'"
          class="flex-1 py-2 rounded-md"
        >
          Real
        </button>
        <button
          type="button"
          @click="vote = 'Fake'"
          :class="vote === 'Fake' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'"
          class="flex-1 py-2 rounded-md"
        >
          Fake
        </button>
      </div>
      <div v-if="errors.vote" class="text-red-600 text-sm">{{ errors.vote }}</div>

      <div>
        <BaseInput v-model="comment" label="Comment" placeholder="Write your comment" />
        <div v-if="errors.comment" class="text-red-600 text-sm mt-1">{{ errors.comment }}</div>
      </div>

      <div class="col-span-full">
        <div class="mt-2 flex items-center gap-x-3">
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-3">
              Upload a Comment Image
            </label>
            <CommentImageUpload v-model="imageUrls"/>
          </div>
        </div>
      </div>

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