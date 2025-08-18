<script setup lang="ts">
import type { News } from '@/types';
import Carousel from 'primevue/carousel';
import { getUserProfile } from '@/utils/userProfile';
import { formatDate } from '@/utils/dateFormatter';

defineProps<{
  news: News[]
}>();

</script>

<template>
  <div class="relative">
    <Carousel :value="news" :numVisible="1">
    <template #item="data">
      <div class="relative">
        <img class="w-full h-[500px] object-cover rounded-lg" :src="data.data.imageUrl" alt="News Image" />
          <div class="absolute flex flex-col bottom-0 left-0 right-0 p-6 rounded-b-lg text-white gap-3">
                  <div class="text-neutral-600 flex items-center gap-2">
            <div :class="[getUserProfile(data.data.reporter || '').bgColor, 'rounded-full w-6 h-6 flex items-center justify-center text-white']">{{ getUserProfile(data.data.reporter || '').initials }}</div>
            <span class="text-sm text-white">{{ data.data.reporter }} • </span>
            <span class="text-sm text-white">{{ formatDate(data.data.reportDate) }}</span>
          </div>
          <h2 class="text-3xl font-bold font-sumana">{{ data.data.topic }}</h2>
          <p>{{ data.data.shortDetail }}</p>
        </div>
      </div>
    </template>
  </Carousel>
  </div>
</template>
