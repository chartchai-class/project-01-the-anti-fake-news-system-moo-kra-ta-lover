<script setup lang="ts">
import NavTab from '@/components/home-page/NavTab.vue';
import { useNewsStore } from '@/stores/news';
import { formatDate } from '@/utils/dateFormatter';
import { getUserProfile } from '@/utils/userProfile';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const store = useNewsStore()
const { news } = storeToRefs(store)

const userProfile = computed(() => getUserProfile(news.value?.reporter || ''));

</script>
<template>
    <div v-if="news">
    <div class="mx-auto max-w-7xl lg:px-8">

        <div v-if="news">
            <img
            v-if="news.imageUrl && news.imageUrl.length > 0"
            :src="news.imageUrl[0]"
            alt="News Image" class="w-full h-90 object-cover mx-auto my-6"
            />
        </div>

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

    <div class="divide-neutral-200 flex gap-3">
        <router-link :to="{ name: 'news-comment-view' }">
            <NavTab
                text="Comments"
                :isActive="$route.name === 'news-comment-view'"
            />
        </router-link>

        <router-link :to="{ name: 'news-vote-view' }">
            <NavTab
                text="Vote"
                :isActive="$route.name === 'news-vote-view'"
            />
        </router-link>
    </div>
    
     <router-view />

    </div>
    </div>
</template>
