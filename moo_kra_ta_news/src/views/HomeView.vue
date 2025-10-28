<!-- HomePage.vue -->
<script setup lang="ts">
import NavTab from '@/components/home-page/NavTab.vue';
import NewsCard from '@/components/NewsCard.vue';
import NewsService from '@/services/NewsService';
import { useNewsFilterStore, type FilterType } from '@/stores/newsFilter';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import NewsCarousel from '../components/home-page/NewsCarousel.vue';
import SearchInput from '@/components/home-page/SearchInput.vue';

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

  document.addEventListener('click', handleClickOutside);
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

// Pagination logic
const currentPage = ref(1);
const itemsPerPage = ref(4);
const pageSizes = [4, 8, 12, 16, 20];

// Computed properties from store
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return newsFilterStore.filteredNews.slice(start, end);
});

// Computed property for the total number of pages
const totalPages = computed(() => {
  return Math.ceil(newsFilterStore.filteredNews.length / itemsPerPage.value);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Watch for changes in itemsPerPage and reset currentPage
watch(itemsPerPage, () => {
  currentPage.value = 1;
});

const isDropdownOpen = ref(false);

// Watch for clicks outside the dropdown to close it
function handleClickOutside(event: MouseEvent) {
  const dropdownElement = document.getElementById('items-per-page-dropdown');
  const dropdownButton = document.getElementById('dropdown-button');

  if (dropdownElement && dropdownButton && !dropdownElement.contains(event.target as Node) && !dropdownButton.contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
}

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const selectPageSize = (size: number) => {
  itemsPerPage.value = size;
  isDropdownOpen.value = false; // Close the dropdown after selection
};

// Toggle dropdown visibility
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

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
      <div v-if="newsFilterStore.filteredNews.length > 0" class="flex flex-col w-full md:w-auto md:flex-row items-center gap-3">
        <!-- Items per page dropdown -->
        <div class="relative inline-block text-left w-full">
          <button id="dropdown-button" @click="toggleDropdown"
            class="inline-flex items-center justify-between w-full md:min-w-[12rem] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
            type="button">
            <span>Show {{ itemsPerPage }} per page</span>
            <svg class="-mr-1 ml-2 h-5 w-5 transition-transform duration-200" :class="{ 'rotate-180': isDropdownOpen }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              aria-hidden="true">
              <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
          <div v-if="isDropdownOpen" id="items-per-page-dropdown"
            class="absolute right-0 mt-2 w-full origin-top-right rounded-lg shadow-xl bg-white border border-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-56 overflow-auto p-1">
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">
              <button v-for="size in pageSizes" :key="size" type="button" @click.stop="selectPageSize(size)"
                :class="[
                  'flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500',
                  size === itemsPerPage ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                ]"
                role="menuitem">
                <span class="flex-1">{{ size }} per page</span>
                <svg v-if="size === itemsPerPage" class="h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 10l3 3 7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination controls -->
        <div class="flex items-center gap-2">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
            class="px-3 py-2 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{ 'bg-neutral-200 hover:bg-neutral-300': currentPage !== 1 }">
            Prev
          </button>
          <div class="flex gap-1">
            <button v-for="page in totalPages" :key="page" @click="changePage(page)"
              class="px-3 py-2 rounded-md transition-colors duration-300 text-sm" :class="{
                'bg-red-600 text-white hover:bg-red-700': currentPage === page,
                'bg-neutral-200 hover:bg-neutral-300': currentPage !== page
              }">
              {{ page }}
            </button>
          </div>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{ 'bg-neutral-200 hover:bg-neutral-300': currentPage !== totalPages }">
            Next
          </button>
        </div>
      </div>
    </div>

    <div v-if="paginatedNews.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
      <NewsCard v-for="newsItem in paginatedNews" :key="newsItem.id" :news="newsItem" />
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
