<script setup lang="ts">
import StatusCard from '@/components/home-page/StatusCard.vue';
import { type News } from '@/types';
import { formatDate } from '@/utils/dateFormatter';
import { getUserProfile } from '@/utils/userProfile';
import { computed } from 'vue';

const props = defineProps<{
  news: News;
}>();

const userProfile = computed(() => getUserProfile(props.news.reporter || ''));

const realComments = computed(() => {
  return props.news.comments?.filter(comment => comment.vote === 'Real').length || 0;
});

const fakeComments = computed(() => {
  return props.news.comments?.filter(comment => comment.vote === 'Fake').length || 0;
});

</script>

<template>
  <RouterLink :to=" { name: 'news-detail-view', params: { id: news.id } }">
    <div class="cursor-pointer flex flex-col w-full gap-3.5 hover:scale-101">
      <div class="relative">
        <img
        v-if="news.imageUrl && news.imageUrl.length > 0"
        :src="news.imageUrl[0]"
        alt="News Image"
        class="w-full h-72 object-cover rounded-xl mb-2"
        />
        <StatusCard :isReal="realComments > fakeComments" :text="realComments > fakeComments ? 'Trusted' : 'Fake'"></StatusCard>
      </div>
      <div class="text-neutral-600 flex items-center gap-2">
        <div :class="[userProfile.bgColor, 'rounded-full w-6 h-6 flex items-center justify-center text-white']">{{ userProfile.initials }}</div>
        <span class="text-sm">{{ news.reporter }} • </span>
        <span class="text-sm">{{ formatDate(news.reportDate) }}</span>
      </div>
      <h2 class="font-sumana font-semibold tracking-tight text-2xl">{{ news.topic }}</h2>
      <span class="text-neutral-600 text-sm">{{ news.shortDetail }}</span>
    </div>
  </RouterLink>
</template>
