<script setup lang="ts">
import { useNewsStore } from '@/stores/news';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

const store = useNewsStore()
const { news } = storeToRefs(store)

// Define emits for parent-child communication
const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:itemsPerPage': [size: number]
}>()

// Define props to receive current state from parent
const props = defineProps<{
  currentPage: number
  itemsPerPage: number
}>()

// Pagination options
const pageSizes = [4, 8, 12, 16, 20];

const totalPages = computed(() => {
  const total = news.value?.comments?.length || 0;
  return Math.max(1, Math.ceil(total / props.itemsPerPage));
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page);
  }
};

// Watch for itemsPerPage changes and reset to first page
watch(() => props.itemsPerPage, () => {
  emit('update:currentPage', 1);
});

const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
const selectPageSize = (size: number) => {
  emit('update:itemsPerPage', size);
  isDropdownOpen.value = false;
};

</script>

<template>
   <div v-if="news && news.comments" class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <!-- Items per page dropdown -->
        <div class="relative inline-block text-left">
          <button id="dropdown-button" @click="toggleDropdown"
            class="inline-flex items-center justify-between w-full sm:min-w-[12rem] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
            type="button">
            <span>Show {{ itemsPerPage }} per page</span>
            <svg class="-mr-1 ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" :class="{ 'rotate-180': isDropdownOpen }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              aria-hidden="true">
              <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
          <div v-if="isDropdownOpen" id="items-per-page-dropdown"
            class="absolute right-0 mt-2 w-full sm:w-56 origin-top-right rounded-lg shadow-xl bg-white border border-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-56 overflow-auto p-1">
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">
              <button v-for="size in pageSizes" :key="size" type="button" @click.stop="selectPageSize(size)"
                :class="[
                  'flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-xs sm:text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500',
                  size === itemsPerPage ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                ]"
                role="menuitem">
                <span class="flex-1">{{ size }} per page</span>
                <svg v-if="size === itemsPerPage" class="h-3 w-3 sm:h-4 sm:w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 10l3 3 7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination controls -->
        <div class="flex items-center gap-1 sm:gap-2">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
            class="px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            :class="{ 'bg-neutral-200 hover:bg-neutral-300': currentPage !== 1 }">
            Prev
          </button>
          <div class="flex gap-1">
            <button v-for="page in totalPages" :key="page" @click="changePage(page)"
              class="px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-colors duration-300 text-xs sm:text-sm" :class="{
                'bg-red-600 text-white hover:bg-red-700': currentPage === page,
                'bg-neutral-200 hover:bg-neutral-300': currentPage !== page
              }">
              {{ page }}
            </button>
          </div>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            :class="{ 'bg-neutral-200 hover:bg-neutral-300': currentPage !== totalPages }">
            Next
          </button>
        </div>
      </div>
</template>