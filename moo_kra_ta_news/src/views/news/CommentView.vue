<script setup lang="ts">
import CommentItem from '@/components/CommentItem.vue';
import CommentPagination from '@/components/CommentPagination.vue';
import NewsService from '@/services/NewsService';
import { useNewsStore } from '@/stores/news';
import { Check, TriangleAlert } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
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

const router = useRouter()

const handleDeleteComment = async (commentId: number) => {
  try {
    await NewsService.deleteComment(commentId)
    
    // Remove from local state
    if (news.value?.comments) {
      const commentIndex = news.value.comments.findIndex(comment => comment.id === commentId)
      if (commentIndex !== -1) {
        news.value.comments.splice(commentIndex, 1)
      }
    }
    
  } catch (error) {
    console.error('Failed to delete comment:', error)
    router.push({ name: 'network-error-view' })
  }
}

</script>

<template>
  <div>
    <div class="my-3 sm:my-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="gap-3 sm:gap-5 flex items-center">
        <span class="font-inter text-xl sm:text-2xl">Comment</span> 
        <div class="h-5 w-7 sm:h-6 sm:w-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
          <span class="text-sm sm:text-base font-inter">{{ totalComments }}</span>
        </div>
      </div>

      <CommentPagination :current-page="currentPage"
        :items-per-page="itemsPerPage"
        @update:current-page="handlePageChange"
        @update:items-per-page="handleItemsPerPageChange"/>
    </div>

    <div class="my-3 sm:my-6 flex flex-row flex-wrap items-center gap-3 sm:gap-10 font-inter text-base sm:text-xl mt-5">
      <span class="flex gap-2 items-center"> 
        <div class="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
          <Check />
        </div>
        Real Comments ({{ realComments }}) 
      </span>

      <span class="flex gap-2 items-center"> 
        <div class="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
          <TriangleAlert />
        </div>
        Fake Comments ({{ fakeComments }})
      </span>
    </div>

    <div v-if="news && news.comments">
      <CommentItem 
        v-for="comment in paginatedComments" :key="comment.id" :comment="comment" @delete-comment="handleDeleteComment"
      />
    </div>
  </div>
</template>