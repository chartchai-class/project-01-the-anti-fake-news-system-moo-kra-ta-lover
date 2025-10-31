<script setup lang="ts">
import CommentItem from '@/components/CommentItem.vue';
import NewsCard from '@/components/NewsCard.vue';
import NewsService from '@/services/NewsService';
import { computed, onMounted, ref } from 'vue';

const activeTab = ref<'news' | 'comments'>('news');

const deletedNews = ref([]);
const deletedComments = ref([]);

const fetchDeletedData = () => {
  Promise.all([
    NewsService.getAdminNews(),      // returns only deleted news
    NewsService.getAdminComments(),  // returns only deleted comments
  ])
    .then(([newsRes, commentsRes]) => {
      deletedNews.value = newsRes.data;
      deletedComments.value = commentsRes.data;
    })
    .catch((err) => {
      console.error('Failed to fetch deleted data:', err);
      deletedNews.value = [];
      deletedComments.value = [];
    });
};

onMounted(() => {
  fetchDeletedData();
});

const groupedComments = computed(() => {
  const groups: Record<string, any[]> = {};
  for (const comment of deletedComments.value) {
    const newsTitle = comment.news?.topic || 'Unknown News';
    if (!groups[newsTitle]) {
      groups[newsTitle] = [];
    }
    groups[newsTitle].push(comment);
  }
  return groups;
});
</script>

<template>
  <main class="flex flex-col mx-auto max-w-7xl gap-6 p-6 lg:px-8">
    <h1 class="text-3xl font-bold text-center mb-6">Admin - Deleted Items</h1>

    <!-- Tabs -->
    <div class="flex justify-center gap-4 mb-6">
      <button
        @click="activeTab = 'news'"
        :class="activeTab === 'news' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'"
        class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-red-200 transition"
      >
        Deleted News
      </button>
      <button
        @click="activeTab = 'comments'"
        :class="activeTab === 'comments' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'"
        class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-red-200 transition"
      >
        Deleted Comments
      </button>
    </div>

    <!-- Deleted News -->
    <div v-show="activeTab === 'news'">
      <div v-if="deletedNews.length === 0" class="text-center text-gray-500">No deleted news found.</div>
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
      >
        <NewsCard v-for="newsItem in deletedNews" :key="newsItem.id" :news="newsItem" :showDeleteButton="false"/>
      </div>
    </div>

    <!-- Deleted Comments Grouped by News -->
    <div v-show="activeTab === 'comments'">
      <div v-if="deletedComments.length === 0" class="text-center text-gray-500">
        No deleted comments found.
      </div>

      <div v-else class="space-y-8">
        <div
          v-for="(comments, newsTitle) in groupedComments"
          :key="newsTitle"
          class="border rounded-lg shadow-sm p-4 bg-white"
        >
          <h2 class="text-xl font-semibold mb-4 text-red-600 border-b pb-2">
            {{ newsTitle }}
          </h2>

          <div class="space-y-4">
            <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" :showDeleteButton="false"/>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
