<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NewsService from '@/services/NewsService'
import BaseInput from './BaseInput.vue'
import type { News, Comment } from '@/types'

const route = useRoute()
const router = useRouter()
const newsId = Number(route.params.id)

const news = ref<News | null>(null)
const alertMessage = ref('')

// form for posting comment
const form = reactive({
  name: '',
  comment: '',
  vote: 'Real' as 'Real' | 'Fake',
  imageUrl: '',
  voted: false
})

// total comments
const totalComments = computed(() => news.value?.comments?.length || 0)

// show alert helper
function showAlert(message: string) {
  alertMessage.value = message
  setTimeout(() => alertMessage.value = '', 3000)
}

// fetch news detail with comments
const loadNews = async () => {
  try {
    const response = await NewsService.getNewsById(newsId)
    news.value = response.data
  } catch (error) {
    console.error(error)
    router.push({ name: 'network-error-view' })
  }
}

// save a comment
async function saveComment() {
  if (!form.name.trim()) return showAlert('⚠️ Please enter your name.')
  if (!form.comment.trim()) return showAlert('⚠️ Please write a comment.')

  try {
    await NewsService.saveComment(newsId, {
  user: form.name,
  vote: form.vote,
  comment: form.comment,
  imageUrls: form.imageUrl ? [form.imageUrl] : []
});

    showAlert('✅ Comment posted!')

    // Reset form
    form.name = ''
    form.comment = ''
    form.vote = 'Real'
    form.imageUrl = ''
    form.voted = false

    // Reload comments
    await loadNews()
  } catch (error) {
    console.error(error)
    router.push({ name: 'network-error-view' })
  }
}

onMounted(() => {
  loadNews()
})
</script>

<template>
  <div v-if="news" class="max-w-4xl mx-auto p-6">

    <!-- Alert -->
    <div v-if="alertMessage" class="mb-4 p-3 rounded-lg bg-red-100 text-red-700 font-medium">
      {{ alertMessage }}
    </div>

    <h2 class="text-2xl font-bold mb-4">
    Comments ({{ totalComments }})
  </h2>

    <!-- Post Comment Form -->
    <form @submit.prevent="saveComment" class="space-y-3">
      <BaseInput v-model="form.name" type="text" label="Your Name" placeholder="Enter your name" />
      <div class="flex gap-4">
        <button type="button" @click="form.vote='Real'; form.voted=true" 
          :class="form.vote==='Real' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'"
          class="flex-1 py-2 rounded-md">Real</button>
        <button type="button" @click="form.vote='Fake'; form.voted=true" 
          :class="form.vote==='Fake' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'"
          class="flex-1 py-2 rounded-md">Fake</button>
      </div>
      <BaseInput v-model="form.comment" type="text" label="Comment" placeholder="Write your comment" />
      <BaseInput v-model="form.imageUrl" type="text" label="Image URL (optional)" placeholder="https://..." />
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md">Post Comment</button>
    </form>
  </div>
</template>