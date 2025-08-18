<script setup lang="ts">
import type { News } from '@/types';
import Carousel from 'primevue/carousel';
defineProps<{
  news: News[]
}>();
</script>

<template>
  <Carousel>
    <template v-slot:item="{ data }">
      <div class="news-item">
        <img :src="data.imageUrl" alt="News Image" />
        <h2>{{ data.title }}</h2>
        <p>{{ data.summary }}</p>
      </div>
    </template>
  </Carousel>
</template>
