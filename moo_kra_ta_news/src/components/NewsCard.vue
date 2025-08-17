<script setup lang="ts">
import { type News } from '@/types';
defineProps<{
  news: News;
}>()
</script>

<template>
  <div class="event-class">
  <RouterLink class="event-link" :to=" { name: 'event-detail-view', params: { id: news.id } }">
    <div class="cursor-pointer border border-grey-600 p-4 w-64 mb-6 hover:scale-101 hover:shadow-sp">
      <h2>{{ news.topic }}</h2>
      <span>{{ news.shortDetail }}}</span>
    </div>
  </RouterLink>
  </div>
</template>