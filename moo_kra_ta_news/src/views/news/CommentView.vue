<script setup lang="ts">
import CommentItem from '@/components/CommentItem.vue';
import { useNewsStore } from '@/stores/news';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

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



</script>

<template>
  <div>
    <div class="my-6 gap-5 flex items-center">
      <span class="font-inter text-2xl">Comment</span> 
      <div class="h-6 w-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
        <span class="text-base font-inter">{{ totalComments }}</span>
      </div>
    </div>

    <div class="my-6">
      <p class="font-inter text-xl">Real Comments ({{ realComments }})  Fake Comments ({{ fakeComments }})</p>
    </div>

    <div v-if="news && news.comments">
      <CommentItem 
        v-for="comment in news.comments" :key="comment.id" :comment="comment"
      />
    </div>
  </div>
</template>