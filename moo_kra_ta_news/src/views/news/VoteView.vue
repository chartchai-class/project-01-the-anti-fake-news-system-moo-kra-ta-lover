<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import NewsService from '@/services/NewsService'
import type { News } from '@/types'
import CommentScetion from '@/components/CommentScetion.vue'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const news = ref<News | null>(null)

watchEffect(() => {
  if (id.value) {
    NewsService.getNewsById(id.value)
      .then(response => {
        news.value = response.data
      })
      .catch(error => {
        console.error('Error fetching news:', error)
      })
  }
})

</script>

<template>
  <div class="min-h-screen bg-gradient-subtle">
    <div class="container mx-auto px-4 py-8">
      <div class="space-y-8">
        <!-- Header -->
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-blue-600 ">
            News Verification Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-gray-500">
            Help the community verify news authenticity. Read, vote, and discuss to combat
            misinformation.
          </p>
        </div>

        <!-- News section -->
        
        
        <!-- comments -->
        <CommentScetion />
      </div>

    </div>
  </div>
</template>
