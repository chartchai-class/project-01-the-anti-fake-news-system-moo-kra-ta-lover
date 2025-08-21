<script setup lang="ts">
import CommentItem from '@/components/CommentItem.vue';
import CommentPagination from '@/components/CommentPagination.vue';
import { useNewsStore } from '@/stores/news';
import { Check, TriangleAlert } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
const store = useNewsStore()
const { news } = storeToRefs(store)

const totalComments = computed(() => {
  return news.value?.comments?.length || 0;
});

const realComments = computed(() => {
  return news.value?.comments?.filter(comment => comment.vote === 'Real').length || 0;
});

const fakeComments = computed(() => {
  return news.value?.comments?.filter(comment => comment.vote === 'Fake').length || 0;
});

// Pagination state for comments
const currentPage = ref(1);
const itemsPerPage = ref(4);

const paginatedComments = computed(() => {
  const all = news.value?.comments || [];
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return all.slice(start, end);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleItemsPerPageChange = (size: number) => {
  itemsPerPage.value = size;
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
});

</script>

<template>
  <div>
    <div class="my-6 flex items-center justify-between">
      <div class="gap-5 flex items-center">
        <span class="font-inter text-2xl">Comment</span> 
        <div class="h-6 w-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
          <span class="text-base font-inter">{{ totalComments }}</span>
        </div>
      </div>

      <CommentPagination :current-page="currentPage"
        :items-per-page="itemsPerPage"
        @update:current-page="handlePageChange"
        @update:items-per-page="handleItemsPerPageChange"/>
    </div>

    <div class="my-6 flex items-center gap-10 font-inter text-xl" >
        <span class="flex gap-2"> <Check />  Real Comments ({{ realComments }}) </span>
        <span class="flex gap-2"> <TriangleAlert />  Fake Comments ({{ fakeComments }})</span>
    </div>

    <div v-if="news && news.comments">
      <CommentItem 
        v-for="comment in paginatedComments" :key="comment.id" :comment="comment"
      />
    </div>
  </div>
</template>