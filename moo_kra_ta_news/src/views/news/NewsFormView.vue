<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
    <!-- Header Section -->
    <header class="mb-8">
      <router-link 
        to="/"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6 group hover:bg-black-500 hover:bg-gray-100 px-4 py-2 rounded-xl"
      >
        <span class="text-xl transform transition-all duration-200 group-hover:-translate-x-1 group-hover:opacity-90">
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
      <form @submit.prevent="submitNews" class="space-y-8">
        <!-- News Title -->
        <div>
          <label for="title" class="block text-sm font-semibold text-gray-800 mb-3">
            News Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            placeholder="Enter a clear and concise title"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p class="text-xs text-gray-500 mt-2">Be specific and descriptive</p>
        </div>

        <!-- Short Summary -->
        <div>
          <label for="summary" class="block text-sm font-semibold text-gray-800 mb-3">
            Short Summary <span class="text-red-500">*</span>
          </label>
          <textarea
            id="summary"
            v-model="form.summary"
            rows="3"
            required
            maxlength="300"
            placeholder="Write a brief summary (10–300 characters)"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
          ></textarea>
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>Keep it concise and informative</span>
            <span>{{ form.summary.length }}/300</span>
          </div>
        </div>

        <!-- Full Details -->
        <div>
          <label for="details" class="block text-sm font-semibold text-gray-800 mb-3">
            Full Details <span class="text-red-500">*</span>
          </label>
          <textarea
            id="details"
            v-model="form.details"
            rows="6"
            required
            minlength="50"
            placeholder="Provide complete details about the news (minimum 50 characters)"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
          ></textarea>
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>Include all relevant information and sources</span>
            <span>{{ form.details.length }}+ characters</span>
          </div>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-semibold text-gray-800 mb-3">
            News Image (Optional)
          </label>
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div class="flex-1">
              <input
                type="file"
                ref="fileInput"
                @change="handleImageUpload"
                accept="image/*"
                class="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <span>📁</span>
              <span>Choose File</span>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
          
          <!-- Image Preview -->
          <div v-if="imagePreview" class="mt-4">
            <img :src="imagePreview" alt="Preview" class="max-w-xs rounded-lg shadow-sm border">
            <button
              type="button"
              @click="removeImage"
              class="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>🗑️</span>
              Remove Image
            </button>
          </div>
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

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form state
const form = reactive({
  title: '',
  summary: '',
  details: '',
  image: null as File | null
})

const imagePreview = ref<string | null>(null)

// Form validation
const isFormValid = computed(() => {
  return form.title.trim().length > 0 &&
         form.summary.trim().length >= 10 &&
         form.summary.trim().length <= 300 &&
         form.details.trim().length >= 50
})

// Image handling
function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }
    
    form.image = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

function removeImage() {
  form.image = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const fileInput = ref<HTMLInputElement>()

// Form submission
function submitNews() {
  if (!isFormValid.value) return
  
  // Here you would typically send the form data to your API
  console.log('Submitting news:', form)
  
  // Simulate API call
  // await NewsService.createNews(form)
  
  router.push('/')
}
</script>

<style scoped>
input, textarea {
  transition: all 0.2s ease-in-out;
}

input:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>