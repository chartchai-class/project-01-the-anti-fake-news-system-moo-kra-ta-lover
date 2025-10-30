<!-- HomePage.vue -->
<script setup lang="ts">
import NavTab from '@/components/home-page/NavTab.vue';
import NewsCard from '@/components/NewsCard.vue';
import NewsService from '@/services/NewsService';
import { useNewsFilterStore, type FilterType } from '@/stores/newsFilter';
import { computed, onMounted, ref } from 'vue';
import NewsCarousel from '../components/home-page/NewsCarousel.vue';
import SearchInput from '@/components/home-page/SearchInput.vue';
import PaginationControls from '@/components/home-page/HomePagination.vue';

// Use the store
const newsFilterStore = useNewsFilterStore();

// Computed properties from store
//const filteredNews = computed(() => newsFilterStore.filteredNews);
const activeFilter = computed(() => newsFilterStore.activeFilter);
// const newsCount = computed(() => newsFilterStore.newsCount);

// Load news on mount
onMounted(async () => {
  const response = await NewsService.getNews();
  newsFilterStore.setNews(response.data);
  console.log('News loaded:', response.data);

  // document.addEventListener('click', handleClickOutside);
});

// Handle tab clicks
const handleTabClick = (filter: FilterType) => {
  newsFilterStore.setFilter(filter);
  currentPage.value = 1;
};

// Get the title based on active filter
const sectionTitle = computed(() => {
  switch (activeFilter.value) {
    case 'trusted':
      return 'Trusted News';
    case 'fake':
      return 'Fake News';
    default:
      return 'All News';
  }
});

// Reactive data
const currentPage = ref(1);
const itemsPerPage = ref(4);

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return newsFilterStore.filteredNews.slice(start, end);
});


const handlePageChange = (page: number) => {
  currentPage.value = page;
};
const handlePageSizeChange = (size: number) => {
  itemsPerPage.value = size;
};

const handleDeleteNews = async (newsId: number) => {
  try {
    await NewsService.deleteNews(newsId)
    newsFilterStore.allNews = newsFilterStore.allNews.filter(news => news.id !== newsId)
  } catch (error) {
    console.error('Failed to delete news:', error)
    alert('Failed to delete news')
  }
}
</script>

<template>
  <main class="flex flex-col mx-auto max-w-7xl gap-6 p-6 lg:px-8" >
    <div class="w-full flex flex-col items-center justify-center bg-neutral-100 rounded-lg py-6">
      <h1 class="uppercase tracking-[3.20px] font-medium leading-loose">Welcome to Moo Kra Ta News</h1>
      <div class="text-2xl md:text-3xl font-semibold leading-[50px] text-center flex flex-col items-center justify-center">
        <span>Share <span class="text-red-600">the news</span>, uncover <span class="text-red-600">the truth</span>,
        </span>
        <span>and banish <span class="text-red-600">fake news</span> for good</span>
      </div>
    </div>

    <NewsCarousel :news="newsFilterStore.allNews" />

    <SearchInput />

    <div class="divide-x-2 divide-neutral-200 flex gap-3">
      <NavTab text="All" :isActive="activeFilter === 'all'" @click="handleTabClick('all')" />
      <div class="gap-4 flex pl-3">
        <NavTab text="Trusted News" :isActive="activeFilter === 'trusted'" @click="handleTabClick('trusted')" />
        <NavTab text="Fake News" :isActive="activeFilter === 'fake'" @click="handleTabClick('fake')" />
      </div>
    </div>

    <div class="flex md:flex-row flex-col items-start md:items-center justify-between gap-2">
      <h1 class="text-2xl text-left font-semibold">{{ sectionTitle }}</h1>

      <!-- Home Page Pagination -->
      <div v-if="newsFilterStore.filteredNews.length > 0">
      <PaginationControls
        :total-items="newsFilterStore.filteredNews.length"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
    </div>

    <div v-if="paginatedNews.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
      <NewsCard v-for="newsItem in paginatedNews" :key="newsItem.id" :news="newsItem" @delete-news="handleDeleteNews"/>
    </div>



    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-neutral-500">
      <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-lg font-medium">No {{ activeFilter === 'all' ? '' : activeFilter }} news found</p>
      <p class="text-sm mt-1">Try selecting a different filter</p>
    </div>
  </main>
</template>
