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

const notification = ref({
  show: false,
  message: '',
})

const showNotification = (message: string) => {
  notification.value = {
    show: true,
    message,
  }
  
  setTimeout(() => {
    notification.value.show = false
  }, 6000)
}

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

// Form validation 
const isFormValid = computed(() => {
  return (
    news.value.topic.trim().length > 0 &&
    news.value.shortDetail.trim().length >= 10 &&
    news.value.shortDetail.trim().length <= 300 &&
    news.value.fullDetail.trim().length >= 50 &&
    singleImageArray.value.length > 0 &&
    singleImageArray.value[0].trim().length > 0 
  )
})

// Single image array for the upload component
const singleImageArray = ref<string[]>([])

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

    const userFullName = `${authStore.user?.firstname || ''} ${authStore.user?.lastname || ''}`.trim()
    news.value.reporter = userFullName || 'Anonymous'
    
    news.value.reportDate = new Date().toISOString()

    const newsData = {
      topic: news.value.topic,
      shortDetail: news.value.shortDetail,
      fullDetail: news.value.fullDetail,
      reporter: news.value.reporter,
      reportDate: news.value.reportDate,
      imageUrl: news.value.imageUrl
    }

    console.log('Sending to backend:', newsData)

    const response = await NewsService.saveNews(newsData)
    console.log('News saved successfully:', response)

    showNotification('🎉 News posted successfully! Redirecting to home page...')
    
    setTimeout(() => {
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
      
      router.push('/')
    }, 2000)
    
  } catch (error) {
    console.error('Error saving news:', error)
    router.push({ name: 'network-error-view' })
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
    <!-- Success Notification Only -->
    <div
      v-if="notification.show"
      class="fixed top-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-lg border transform transition-all duration-300 bg-green-50 border-green-200 text-green-800"
    >
      <div class="flex items-center gap-3">
        <span class="text-xl text-green-600">
          ✅
        </span>
        <div class="flex-1">
          <p class="font-medium text-sm">{{ notification.message }}</p>
        </div>
        <button
          @click="notification.show = false"
          class="p-1 rounded-full hover:bg-green-600 hover:bg-opacity-20 text-green-600 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>

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

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-semibold text-gray-800 mb-3">
            News Image
          </label>
          <ImageUpload 
    v-model="singleImageArray" 
    :max-files="1" 
  />
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