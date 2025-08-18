<script setup lang="ts">
import NewsService from '@/services/NewsService';
import type { News } from '@/types';
import { formatDate } from '@/utils/dateFormatter';
import { getUserProfile } from '@/utils/userProfile';
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import CommentView from './CommentView.vue';

const news = ref<News | null>(null);
const id = ref<number>(2);

// const props = defineProps<{
//   id: number;
// }>();

// console.log(props.id, "id");

const userProfile = computed(() => getUserProfile(news.value?.reporter || ''));

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

</script>
<template>

    <div v-if="news">
        <img
            v-if="news.imageUrl && news.imageUrl.length > 0"
            :src="news.imageUrl[0]"
            alt="News Image" class="w-full h-90 object-cover mx-auto my-6"
        />
    </div>

    <div class="mx-auto max-w-7xl lg:px-8">
    <div v-if="news">
        <div class="my-6">
            <h1 class="font-sumana text-4xl font-bold">{{ news.topic }}</h1>
        </div>

        <div class="flex items-center gap-2">
            <div :class="[userProfile.bgColor, 'rounded-full w-10 h-10 flex items-center justify-center text-3xl text-white']">{{ userProfile.initials }}</div>
            <span>{{ news.reporter }} • {{ formatDate(news.reportDate) }}</span>
        </div>

        <div class="my-6">
            <p class="font-inter text-xl">{{ news.fullDetail }}</p>
        </div>

    </div>

    <RouterLink to="/Vote">
    <div class="my-8">
        <button class="flex p-4 justify-between items-center w-full bg-[#F5F5F5] rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">

            <div class="flex-shrink-0 rounded-full p-4 bg-white">
                <img src="@/assets/Text_logo.svg" alt="" class="w-6 h-6">
            </div>


            <div class="flex-1 text-left ml-4">
                <h3 class="font-semibold text-gray-900 font-inter text-lg">Share Your Opinion With Us</h3>
                <p class="text-base text-gray-500 mt-1 font-inter">Vote whether the news is fake or not and comment your opinion.</p>
            </div>


            <div class="flex-shrink-0 ml-4">
                <img src="@/assets/Arrow_right.svg" alt="" class="w-5 h-5">
            </div>
        </button>
    </div>
      </RouterLink>
      <CommentView/>
    </div>
</template>
