<script setup lang="ts">
import type { Comment } from '@/types';
defineProps<{
  comment: Comment;
}>();
</script>


<template>
    <div>
        <div class="border border-grey-600 bg-[#F5F5F5] p-4 mb-6 hover:scale-101 hover:shadow-sp w-full rounded-lg">
            <div class="flex items-center gap-2 font-inter">
                <div class="rounded-full w-8 h-8 bg-indigo-500 flex items-center justify-center text-xl text-white">{{ comment.user.charAt(0).toUpperCase() }}</div>
                <span><p>{{ comment.user }}</p></span>
            </div>
            <p>{{ comment.vote }}</p>
            <img 
            v-if="comment.imageUrl && comment.imageUrl.length > 0" 
            :src="comment.imageUrl[0]" 
            alt="News Image" class="my-6"
            />
            <p>{{ comment.comment }}</p>
        </div>
    </div>

</template>