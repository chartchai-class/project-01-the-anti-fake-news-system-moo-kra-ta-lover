<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ImageUpload from '@/components/ImageUpload.vue'
import NewsService from '@/services/NewsService'
import { useAuthStore } from '@/stores/auth'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'

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

// Validation Schema
const validationSchema = yup.object({
  topic: yup
    .string()
    .required('News title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters'),
  shortDetail: yup
    .string()
    .required('Short summary is required')
    .min(10, 'Summary must be at least 10 characters')
    .max(300, 'Summary must not exceed 300 characters'),
  fullDetail: yup
    .string()
    .required('Full details are required')
    .min(50, 'Full details must be at least 50 characters'),
  imageUrl: yup
    .string()
    .required('News image is required')
})

// Setup Vee-Validate form
const { errors, handleSubmit, meta } = useForm({
  validationSchema,
  initialValues: {
    topic: '',
    shortDetail: '',
    fullDetail: '',
    imageUrl: '',
  },
})

// Form fields
const { value: topic } = useField<string>('topic')
const { value: shortDetail } = useField<string>('shortDetail')
const { value: fullDetail } = useField<string>('fullDetail')
const { value: imageUrl } = useField<string>('imageUrl')

// Single image array for the upload component
const singleImageArray = ref<string[]>([])

watch(singleImageArray, (newImages) => {
  if (newImages.length > 0) {
    imageUrl.value = newImages[0]
    console.log('Image selected:', newImages[0])
  } else {
    imageUrl.value = ''
  }
}, { immediate: true })

// Form submission with validation
const onSubmit = handleSubmit(async (values) => {
  try {
    const userFullName = `${authStore.user?.firstname || ''} ${authStore.user?.lastname || ''}`.trim()

    const newsData = {
      topic: values.topic,
      shortDetail: values.shortDetail,
      fullDetail: values.fullDetail,
      reporter: userFullName || 'Anonymous',
      reportDate: new Date().toISOString(),
      imageUrl: values.imageUrl
    }

    console.log('Sending to backend:', newsData)

    const response = await NewsService.saveNews(newsData)
    console.log('News saved successfully:', response)

    showNotification('🎉 News posted successfully! Redirecting to home page...')

    setTimeout(() => {
      // Reset form
      topic.value = ''
      shortDetail.value = ''
      fullDetail.value = ''
      imageUrl.value = ''
      singleImageArray.value = []

      router.push('/')
    }, 2000)

  } catch (error) {
    console.error('Error saving news:', error)
    router.push({ name: 'network-error-view' })
  }
})
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
      <form @submit="onSubmit" class="space-y-8">
        <!-- News Title -->
        <div>
          <label for="topic" class="block text-sm font-semibold text-gray-800 mb-3">
            News Title <span class="text-red-500">*</span>
          </label>
          <input
            id="topic"
            v-model="topic"
            type="text"
            placeholder="Enter a clear and concise title"
            class="w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            :class="errors.topic ? 'border-red-500' : 'border-gray-300'"
          />
          <p v-if="errors.topic" class="mt-2 text-sm text-red-600">
            {{ errors.topic }}
          </p>
        </div>

        <!-- Short Summary -->
        <div>
          <label for="summary" class="block text-sm font-semibold text-gray-800 mb-3">
            Short Summary <span class="text-red-500">*</span>
          </label>
          <textarea
            id="summary"
            v-model="shortDetail"
            rows="3"
            maxlength="300"
            placeholder="Write a brief summary (10–300 characters)"
            class="w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
            :class="errors.shortDetail ? 'border-red-500' : 'border-gray-300'"
          ></textarea>
          <div class="flex justify-between text-xs mt-2">
            <span :class="errors.shortDetail ? 'text-red-600' : 'text-gray-500'">
              {{ errors.shortDetail || 'Minimum 10 characters' }}
            </span>
            <span class="text-gray-500">{{ shortDetail?.length || 0 }}/300</span>
          </div>
        </div>

        <!-- Full Details -->
        <div>
          <label for="details" class="block text-sm font-semibold text-gray-800 mb-3">
            Full Details <span class="text-red-500">*</span>
          </label>
          <textarea
            id="details"
            v-model="fullDetail"
            rows="6"
            placeholder="Provide complete details about the news (minimum 50 characters)"
            class="w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
            :class="errors.fullDetail ? 'border-red-500' : 'border-gray-300'"
          ></textarea>
          <div class="flex justify-between text-xs mt-2">
            <span :class="errors.fullDetail ? 'text-red-600' : 'text-gray-500'">
              {{ errors.fullDetail || 'Minimum 50 characters' }}
            </span>
            <span class="text-gray-500">{{ fullDetail?.length || 0 }}+ characters</span>
          </div>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-semibold text-gray-800 mb-3">
            News Image <span class="text-red-500">*</span>
          </label>
          <ImageUpload
            v-model="singleImageArray"
            :max-files="1"
          />
          <p v-if="errors.imageUrl" class="mt-2 text-sm text-red-600">
            {{ errors.imageUrl }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            :disabled="!meta.valid"
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
