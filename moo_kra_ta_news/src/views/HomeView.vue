<script setup lang="ts">
import NewsCarousel from '../components/home-page/NewsCarousel.vue';
import type { News } from '@/types';
import { ref, onMounted } from 'vue';
import NewsService from '@/services/NewsService';
import NavTab from '@/components/home-page/NavTab.vue';
import NewsCard from '@/components/NewsCard.vue';
const news = ref<News[]>([]);

onMounted(async () => {
  const response = await NewsService.getNews();
  news.value = response.data;
  console.log(news.value);
});

</script>

<template>
  <main class="flex flex-col mx-auto max-w-7xl gap-4 p-6 lg:px-8 ">
    <div class="w-full flex flex-col items-center justify-center bg-neutral-100 rounded-lg py-6">
       <h1 class="uppercase tracking-[3.20px] font-medium leading-loose">Welcome to Moo Kra Ta News</h1>
        <div class="text-3xl font-semibold leading-[50px] text-center flex flex-col items-center justify-center">
          <span>Share <span class="text-red-600">the news</span>, uncover <span class="text-red-600">the truth</span>, </span>
          <span>and banish <span class="text-red-600">fake news</span> for good</span>
        </div>
    </div>

    <NewsCarousel :news="news" />

    <div class="divide-x-2 divide-neutral-200 flex gap-3">
      <NavTab text="All" :isActive="true" />
      <div class="gap-4 flex pl-3">
        <NavTab text="Trusted News" :isActive="false" />
        <NavTab text="Fake News" :isActive="false" />
      </div>
    </div>

    <h1 class="text-2xl font-semibold">All News</h1>

   <div class="grid grid-cols-4 gap-3 w-full">
     <NewsCard v-for="newsItem in news" :key="newsItem.id" :news="newsItem" />
   </div>

  </main>
</template>
