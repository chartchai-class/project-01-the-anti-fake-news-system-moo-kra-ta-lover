<script setup lang="ts">
import NewsCarousel from '../components/NewsCarousel.vue';
import type { News } from '@/types';
import { ref, onMounted } from 'vue';
import NewsService from '@/services/NewsService';

const news = ref<News[]>([]);

onMounted(async () => {
  const response = await NewsService.getNews();
  news.value = response.data;
  console.log(news.value);
});

</script>

<template>
  <main>
    <NewsCarousel />
    <h1>Welcome to Moo Kra Ta News</h1>
  </main>
</template>
