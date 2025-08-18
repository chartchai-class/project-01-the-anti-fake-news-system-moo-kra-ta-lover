<script setup lang="ts">
import NewsService from '@/services/NewsService';
import type { News } from '@/types';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import CommentView from './CommentView.vue';
const news = ref<News | null>(null);
const id = ref<number>(1);

onMounted(async () => {
  NewsService.getNewsById(id.value)
    .then(response => {
        news.value = response.data;
        console.log(news.value);

    })
    .catch(error => {
        console.error('Error fetching news by ID:', error);
    });
});

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.toLocaleDateString("en-US", { day: "numeric" });
  const year = date.toLocaleDateString("en-US", { year: "numeric" });

  return `${weekday} ${month} ${day}, ${year}`;
}
</script>
<template>

    <div v-if="news">
        <img
        v-if="news.imageUrl && news.imageUrl.length > 0"
        :src="news.imageUrl[0]"
        alt="News Image"
        />

        <h1>{{ news.topic }}</h1>

        <div class="flex items-center gap-2">
            <div class="rounded-full w-10 h-10 bg-indigo-500 flex items-center justify-center text-3xl text-white">{{ news.reporter.charAt(0).toUpperCase() }}</div>
            <span>{{ news.reporter }} • {{ formatDate(news.reportDate) }}</span>
        </div>

        <p>{{ news.fullDetail }}</p>

    </div>

    <RouterLink to="/Vote">
    <div class="m-8">
        <button class="flex p-6 justify-between items-center w-full bg-[#F5F5F5] rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">

            <div class="flex-shrink-0 rounded-full p-4 bg-white">
                <img src="@/assets/Text_logo.svg" alt="" class="w-6 h-6">
            </div>


            <div class="flex-1 text-left ml-4">
                <h3 class="font-semibold text-gray-900">Share Your Opinion With Us</h3>
                <p class="text-sm text-gray-500 mt-1">Vote whether the news is fake or not and comment your opinion.</p>
            </div>


            <div class="flex-shrink-0 ml-4">
                <img src="@/assets/Arrow_right.svg" alt="" class="w-5 h-5">
            </div>
        </button>
    </div>
    </RouterLink>


    <CommentView />

</template>
