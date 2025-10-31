<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NewsService from '@/services/NewsService'
import type { News } from '@/types'
import { useNewsStore } from '@/stores/news'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'

const route = useRoute()
const router = useRouter()
const newsId = Number(route.params.id)
const newsStore = useNewsStore()

const news = ref<News | null>(null)
const isLoading = ref(false)

type VoteType = 'Real' | 'Fake'

// Validation Schema
const validationSchema = yup.object({
  user: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  vote: yup
    .string()
    .required('Please select Real or Fake')
    .oneOf(['Real', 'Fake'], 'Vote must be either Real or Fake'),
  comment: yup
    .string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment must not exceed 500 characters'),
  imageUrl: yup
    .string()
    .url('Please provide a valid URL')
    .nullable()
    .transform((value) => value || null),
})

// Setup Vee-Validate form
const { errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema,
  initialValues: {
    user: '',
    vote: 'Real' as VoteType,
    comment: '',
    imageUrl: '',
  },
})

// Form fields
const { value: user } = useField<string>('user')
const { value: vote } = useField<VoteType>('vote')
const { value: commentText } = useField<string>('comment')
const { value: imageUrl } = useField<string>('imageUrl')

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

const alertMessage = ref('')

function showAlert(message: string) {
  alertMessage.value = message
  setTimeout(() => (alertMessage.value = ''), 3000)
}

// Save comment with validation
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  try {
    const commentData = {
      user: values.user,
      vote: values.vote,
      comment: values.comment,
      imageUrls: values.imageUrl ? [values.imageUrl] : [],
    }

    const response = await NewsService.saveComment(newsId, commentData)

    // Update news comments
    if (news.value) {
      news.value.comments.push(response.data)
    }

    // Update the store if needed
    if (newsStore.news) {
      newsStore.news.comments.push(response.data)
    }

    // Reset form
    resetForm()
    showAlert('✅ Comment posted!')
  } catch (error) {
    console.error('Failed to save comment:', error)
    router.push({ name: 'network-error-view' })
  } finally {
    isLoading.value = false
  }
})

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
    <div v-if="alertMessage" class="mb-4 p-3 rounded-lg bg-green-100 text-green-700 font-medium">
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

    <form @submit="onSubmit" class="space-y-4">
      <!-- Name Field -->
      <div>
        <label for="user" class="block text-sm font-semibold text-gray-800 mb-2">
          Your Name <span class="text-red-500">*</span>
        </label>
        <input
          id="user"
          v-model="user"
          type="text"
          placeholder="Enter your name"
          class="w-full px-4 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          :class="errors.user ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="errors.user" class="mt-1 text-sm text-red-600">
          {{ errors.user }}
        </p>
      </div>

      <!-- Vote Buttons -->
      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-2">
          Vote <span class="text-red-500">*</span>
        </label>
        <div class="flex gap-4">
          <button
            type="button"
            @click="vote = 'Real'"
            :class="[
              vote === 'Real'
                ? 'bg-green-600 text-white ring-2 ring-green-600 ring-offset-2'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300',
              errors.vote ? 'ring-2 ring-red-500' : ''
            ]"
            class="flex-1 py-2 rounded-md font-medium transition-all"
          >
            ✓ Real
          </button>
          <button
            type="button"
            @click="vote = 'Fake'"
            :class="[
              vote === 'Fake'
                ? 'bg-red-600 text-white ring-2 ring-red-600 ring-offset-2'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300',
              errors.vote ? 'ring-2 ring-red-500' : ''
            ]"
            class="flex-1 py-2 rounded-md font-medium transition-all"
          >
            ✗ Fake
          </button>
        </div>
        <p v-if="errors.vote" class="mt-1 text-sm text-red-600">
          {{ errors.vote }}
        </p>
      </div>

      <!-- Comment Field -->
      <div>
        <label for="comment" class="block text-sm font-semibold text-gray-800 mb-2">
          Comment <span class="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          v-model="commentText"
          rows="4"
          maxlength="500"
          placeholder="Write your comment (minimum 10 characters)"
          class="w-full px-4 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
          :class="errors.comment ? 'border-red-500' : 'border-gray-300'"
        ></textarea>
        <div class="flex justify-between text-xs mt-1">
          <span :class="errors.comment ? 'text-red-600' : 'text-gray-500'">
            {{ errors.comment || 'Minimum 10 characters' }}
          </span>
          <span class="text-gray-500">{{ commentText?.length || 0 }}/500</span>
        </div>
      </div>

      <!-- Image URL Field (Optional) -->
      <div>
        <label for="imageUrl" class="block text-sm font-semibold text-gray-800 mb-2">
          Image URL <span class="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          id="imageUrl"
          v-model="imageUrl"
          type="text"
          placeholder="https://example.com/image.jpg"
          class="w-full px-4 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          :class="errors.imageUrl ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="errors.imageUrl" class="mt-1 text-sm text-red-600">
          {{ errors.imageUrl }}
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading || !meta.valid"
        class="w-full bg-blue-600 text-white py-3 rounded-md font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        {{ isLoading ? 'Posting...' : '📝 Post Comment' }}
      </button>
    </form>
  </div>
</template>
