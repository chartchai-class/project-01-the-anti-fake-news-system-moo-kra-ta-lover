<script setup lang="ts">
import { type News } from '@/types';
import { formatDate } from '@/utils/dateFormatter';
import { computed } from 'vue';
import { getUserProfile } from '@/utils/userProfile';

const props = defineProps<{
  news: News;
}>();

const userProfile = computed(() => getUserProfile(props.news.reporter || ''));
</script>

<template>
  <!-- <RouterLink class="event-link" :to=" { name: 'event-detail-view', params: { id: news.id } }"> -->
    <div class="cursor-pointer flex flex-col w-full gap-3.5 hover:scale-101">
      <img
        v-if="news.imageUrl && news.imageUrl.length > 0"
        :src="news.imageUrl[0]"
        alt="News Image"
        class="w-full h-64 object-cover rounded-xl mb-2"
        />
      <div class="text-neutral-600 flex items-center gap-2">
        <div :class="[userProfile.bgColor, 'rounded-full w-6 h-6 flex items-center justify-center text-white']">{{ userProfile.initials }}</div>
        <span>{{ news.reporter }} • </span>
        <span>{{ formatDate(news.reportDate) }}</span>
      </div>
      <h2 class="font-sumana font-bold text-2xl">{{ news.topic }}</h2>
      <span class="text-neutral-600">{{ news.shortDetail }}</span>
    </div>
  <!-- </RouterLink> -->
</template>
