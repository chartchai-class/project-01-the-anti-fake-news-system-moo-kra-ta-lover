<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import NewsService from '@/services/NewsService'
import type { News } from '@/types'
import { getUserProfile } from '@/utils/userProfile'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const news = ref<News | null>(null)

const userProfile = computed(() => getUserProfile(news.value?.reporter || ''))

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
    <div class="container mx-auto px-4 py-8 max-w-4xl">
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
        <div v-if="news">
          <div class="mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200">
            <div class="flex items-center justify-between">
  <!-- Left: Science tag -->
  <span class="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
    Science
  </span>

  <!-- Right: Reporter avatar + name -->
  <div class="flex items-center space-x-2">
    <div
      :class="[userProfile.bgColor, 'rounded-full w-8 h-8 flex items-center justify-center text-sm text-white']"
    >
      {{ userProfile.initials }}
    </div>
    <span class="text-gray-500 text-sm">{{ news?.reporter }}</span>
  </div>
</div>


            <h2 class="mt-4 text-2xl font-bold text-gray-900">
              <span>{{ news?.topic }}</span>
            </h2>

            <p class="mt-4 text-gray-700 leading-relaxed">
              <span>{{ news?.fullDetail }}</span>
            </p>

          </div>
        </div>

        <!--  -->
      </div>

    </div>
  </div>
</template>
