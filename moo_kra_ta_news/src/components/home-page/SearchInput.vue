<script setup lang="ts">
import { ref } from 'vue';
import { useNewsFilterStore } from '@/stores/newsFilter';
import NewsService from '@/services/NewsService';
import { useRouter } from 'vue-router';

const newsFilterStore = useNewsFilterStore();
const router = useRouter();
const keyword = ref('');

async function updateKeyword() {
  try {
    let response;
    if (keyword.value.trim() === '') {
      response = await NewsService.getNews();
    } else {
      response = await NewsService.getNewsByKeyword(keyword.value);
    }
    newsFilterStore.setNews(response.data);
    console.log('News updated with keyword:', keyword.value, 'Results:', response.data.length);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    router.push({ name: 'NetworkError' });
  }
}

function performSearch() {
  updateKeyword();
}

// Clear search
function clearSearch() {
  keyword.value = '';
  updateKeyword();
}
</script>

<template>
  <div class="w-full flex gap-2 items-center justify-center">
    <div class="relative w-full">
      <input
        class="w-full border border-gray-300 rounded-full p-2 bg-neutral-100 px-4 pr-10"
        v-model="keyword"
        placeholder="Search any news that suit you"
        @input="updateKeyword"
        @keyup.enter="performSearch"
      />
      <button
        v-if="keyword"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        title="Clear search"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <button
      class="rounded-full px-4 py-2 text-sm font-medium bg-red-600 border border-gray-300 text-white hover:bg-red-700 shadow whitespace-nowrap"
      @click="performSearch"
    >
      Search
    </button>
  </div>
</template>
