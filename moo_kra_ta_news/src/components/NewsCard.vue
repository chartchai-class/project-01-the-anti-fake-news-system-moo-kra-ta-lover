<script setup lang="ts">
import { type News } from '@/types';
import { formatDate } from '@/utils/dateFormatter';
defineProps<{
  news: News;
}>()
</script>

<template>
  <!-- <RouterLink class="event-link" :to=" { name: 'event-detail-view', params: { id: news.id } }"> -->
    <div class="cursor-pointer w-full mb-6 hover:scale-101 hover:shadow-sp">
      <img
        v-if="news.imageUrl && news.imageUrl.length > 0"
        :src="news.imageUrl[0]"
        alt="News Image"
        class="w-full h-64 object-cover rounded-xl mb-2"
        />
      <div>
        <span>{{ news.reporter }} • </span>
        <span>{{ formatDate(news.reportDate) }}</span>
      </div>
      <h2>{{ news.topic }}</h2>
      <span>{{ news.shortDetail }}</span>
    </div>
  <!-- </RouterLink> -->
</template>
