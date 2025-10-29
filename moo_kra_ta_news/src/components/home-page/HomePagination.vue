<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted, computed   } from 'vue';

interface Props {
  totalItems: number;
  currentPage?: number;
  itemsPerPage?: number;
}

interface Emits {
  (e: 'page-change', page: number): void;
  (e: 'page-size-change', size: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  itemsPerPage: 4
});

const emit = defineEmits<Emits>();

// Reactive data
const currentPage = ref(props.currentPage);
const itemsPerPage = ref(props.itemsPerPage);
const isDropdownOpen = ref(false);

// Constants
const pageSizes = [4, 8, 12, 16, 20];

// Computed properties
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / itemsPerPage.value);
});

// Methods
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    emit('page-change', page);
  }
};

const selectPageSize = (size: number) => {
  itemsPerPage.value = size;
  isDropdownOpen.value = false;
  emit('page-size-change', size);
  // Reset to first page when changing page size
  currentPage.value = 1;
  emit('page-change', 1);
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Handle click outside dropdown
const handleClickOutside = (event: MouseEvent) => {
  const dropdownElement = document.getElementById('items-per-page-dropdown');
  const dropdownButton = document.getElementById('dropdown-button');

  if (dropdownElement && dropdownButton && 
      !dropdownElement.contains(event.target as Node) && 
      !dropdownButton.contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
};

// Watch for changes in external props
watch(() => props.currentPage, (newPage) => {
  currentPage.value = newPage;
});

watch(() => props.itemsPerPage, (newSize) => {
  itemsPerPage.value = newSize;
});

// Event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
<template>
  <div class="flex flex-col w-full md:w-auto md:flex-row items-center gap-3">
    <!-- Items per page dropdown -->
    <div class="relative inline-block text-left w-full">
      <button 
        id="dropdown-button" 
        @click="toggleDropdown"
        class="inline-flex items-center justify-between w-full md:min-w-[12rem] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
        type="button"
      >
        <span>Show {{ itemsPerPage }} per page</span>
        <svg 
          class="-mr-1 ml-2 h-5 w-5 transition-transform duration-200" 
          :class="{ 'rotate-180': isDropdownOpen }" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path 
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd" 
          />
        </svg>
      </button>
      <div 
        v-if="isDropdownOpen" 
        id="items-per-page-dropdown"
        class="absolute right-0 mt-2 w-full origin-top-right rounded-lg shadow-xl bg-white border border-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-56 overflow-auto p-1"
      >
        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">
          <button 
            v-for="size in pageSizes" 
            :key="size" 
            type="button" 
            @click.stop="selectPageSize(size)"
            :class="[
              'flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500',
              size === itemsPerPage ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            ]"
            role="menuitem"
          >
            <span class="flex-1">{{ size }} per page</span>
            <svg 
              v-if="size === itemsPerPage" 
              class="h-4 w-4 text-red-600" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
            >
              <path d="M5 10l3 3 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center gap-2">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="px-3 py-2 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ 'bg-neutral-200 hover:bg-neutral-300': currentPage !== 1 }"
      >
        Prev
      </button>
      <div class="flex gap-1">
        <button 
          v-for="page in totalPages" 
          :key="page" 
          @click="changePage(page)"
          class="px-3 py-2 rounded-md transition-colors duration-300 text-sm" 
          :class="{
            'bg-red-600 text-white hover:bg-red-700': currentPage === page,
            'bg-neutral-200 hover:bg-neutral-300': currentPage !== page
          }"
        >
          {{ page }}
        </button>
      </div>
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="px-3 py-2 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ 'bg-neutral-200 hover:bg-neutral-300': currentPage !== totalPages }"
      >
        Next
      </button>
    </div>
  </div>
</template>

