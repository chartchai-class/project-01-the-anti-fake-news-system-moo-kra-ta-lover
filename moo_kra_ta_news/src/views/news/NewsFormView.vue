<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import type { News } from '@/types'
import ImageUpload from '@/components/ImageUpload.vue'
import NewsService from '@/services/NewsService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Remove the old form object since we're using news object
const news = ref<News>({
  id: 0,
  topic: '',
  shortDetail: '',
  fullDetail: '',
  reporter: '',
  reportDate: '',
  imageUrl: '',
  comments: [],
})

// Form validation - check the news object instead of form
const isFormValid = computed(() => {
  return (
    news.value.topic.trim().length > 0 &&
    news.value.shortDetail.trim().length >= 10 &&
    news.value.shortDetail.trim().length <= 300 &&
    news.value.fullDetail.trim().length >= 50
  )
})

// Single image array for the upload component
const singleImageArray = ref<string[]>([])

// Watch for image changes and update news.imageUrl
watch(singleImageArray, (newImages) => {
  if (newImages.length > 0) {
    news.value.imageUrl = newImages[0]
    console.log('Image selected:', newImages[0])
  } else {
    news.value.imageUrl = ''
  }
}, { immediate: true })

// Form submission
async function saveNews() {
  try {
    // Set reporter name from auth store
    const userFullName = `${authStore.user?.firstname || ''} ${authStore.user?.lastname || ''}`.trim()
    news.value.reporter = userFullName || 'Anonymous'
    
    // Set current date
    news.value.reportDate = new Date().toISOString()
    
    console.log('Submitting news with reporter:', news.value.reporter)
    console.log('Topic length:', news.value.topic.length)
    console.log('Short detail length:', news.value.shortDetail.length)
    console.log('Full detail length:', news.value.fullDetail.length)
    console.log('Form valid:', isFormValid.value)
    console.log('Full news data:', news.value)

    // Create the data object that matches backend expectations
    const newsDataForBackend = {
      name: news.value.topic,
      shortDetail: news.value.shortDetail,
      fullDetail: news.value.fullDetail,
      reporter: news.value.reporter,
      reportDate: news.value.reportDate,
      imageUrl: news.value.imageUrl
    }

    console.log('Sending to backend:', newsDataForBackend)

    const response = await NewsService.saveNews(newsDataForBackend)
    console.log('News saved successfully:', response)
    
    // Reset form
    news.value = {
      id: 0,
      topic: '',
      shortDetail: '',
      fullDetail: '',
      reporter: '',
      reportDate: '',
      imageUrl: '',
      comments: [],
    }
    singleImageArray.value = []
    
    // Redirect to home page after successful submission
    router.push('/')
    
  } catch (error) {
    console.error('Error saving news:', error)
    alert('Failed to submit news. Please try again.')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
    <!-- Header Section -->
    <header class="mb-8">
      <router-link
        to="/"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6 group hover:bg-black-500 hover:bg-gray-100 px-4 py-2 rounded-xl"
      >
        <span
          class="text-xl transform transition-all duration-200 group-hover:-translate-x-1 group-hover:opacity-90"
        >
          ←
        </span>
        <span class="font-medium">Back to News</span>
      </router-link>

      <div class="text-center sm:text-left">
        <div class="flex items-center justify-center sm:justify-start gap-3 mb-3">
          <span class="text-blue-600 text-3xl">📰</span>
          <h1 class="text-3xl font-bold text-gray-900">Submit News</h1>
        </div>
        <p class="text-gray-600 text-lg max-w-2xl">
          Share news and let the community verify its authenticity
        </p>
        <!-- Show current user -->
        <div v-if="authStore.user" class="mt-2 text-sm text-gray-500">
          Logged in as: <strong>{{ authStore.user.firstname }} {{ authStore.user.lastname }}</strong>
        </div>
        
        <!-- Show form validation status -->
        <div class="mt-2 text-sm">
          <div :class="news.topic.trim().length > 0 ? 'text-green-600' : 'text-red-600'">
            {{ news.topic.trim().length > 0 ? '✅' : '❌' }} Title: {{ news.topic.trim().length }}/1
          </div>
          <div :class="news.shortDetail.trim().length >= 10 && news.shortDetail.trim().length <= 300 ? 'text-green-600' : 'text-red-600'">
            {{ news.shortDetail.trim().length >= 10 && news.shortDetail.trim().length <= 300 ? '✅' : '❌' }} 
            Summary: {{ news.shortDetail.trim().length }}/300 (min 10)
          </div>
          <div :class="news.fullDetail.trim().length >= 50 ? 'text-green-600' : 'text-red-600'">
            {{ news.fullDetail.trim().length >= 50 ? '✅' : '❌' }} 
            Details: {{ news.fullDetail.trim().length }}+ characters (min 50)
          </div>
          <div class="mt-1 font-semibold" :class="isFormValid ? 'text-green-600' : 'text-red-600'">
            {{ isFormValid ? '✅ Form is valid - Ready to submit!' : '❌ Form is incomplete' }}
          </div>
        </div>
      </div>
    </header>

    <!-- Form Section -->
    <div class="bg-white shadow-lg border border-gray-100 rounded-2xl p-6 sm:p-8">
      <form @submit.prevent="saveNews" class="space-y-8">
        <!-- News Title -->
        <div>
          <BaseInput
            v-model="news.topic"
            label="News Title"
            placeholder="Enter a clear and concise title"
          />
        </div>

        <!-- Short Summary -->
        <div>
          <label for="summary" class="block text-sm font-semibold text-gray-800 mb-3">
            Short Summary <span class="text-red-500">*</span>
          </label>
          <textarea
            id="summary"
            v-model="news.shortDetail"
            rows="3"
            required
            maxlength="300"
            placeholder="Write a brief summary (10–300 characters)"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
          ></textarea>
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>Minimum 10 characters</span>
            <span>{{ news.shortDetail.length }}/300</span>
          </div>
        </div>

        <!-- Full Details -->
        <div>
          <label for="details" class="block text-sm font-semibold text-gray-800 mb-3">
            Full Details <span class="text-red-500">*</span>
          </label>
          <textarea
            id="details"
            v-model="news.fullDetail"
            rows="6"
            required
            minlength="50"
            placeholder="Provide complete details about the news (minimum 50 characters)"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
          ></textarea>
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>Minimum 50 characters</span>
            <span>{{ news.fullDetail.length }}+ characters</span>
          </div>
        </div>

        <!-- Image Upload - Only ONE image allowed -->
        <div>
          <label class="block text-sm font-semibold text-gray-800 mb-3">
            News Image
          </label>
          <ImageUpload 
            v-model="singleImageArray" 
            :max-files="1" 
            
          />
          <p class="text-xs text-gray-500 mt-2">
            Supported formats: JPG, PNG, GIF (Max 10MB) - Only one image allowed
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            :disabled="!isFormValid"
            class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/25"
          >
            📤 Submit News
          </button>

          <router-link
            to="/"
            class="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors text-center font-medium"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>