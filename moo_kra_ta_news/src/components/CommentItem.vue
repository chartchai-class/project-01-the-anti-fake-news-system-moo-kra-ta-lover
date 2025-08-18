<script setup lang="ts">
import type { Comment } from '@/types';
import { getUserProfile } from '@/utils/userProfile';
import { computed } from 'vue';

const props = defineProps<{
  comment: Comment;
}>();

const userProfile = computed(() => getUserProfile(props.comment.user || ''));

</script>


<template>
    <div>
        <div class="border border-grey-600 bg-[#F5F5F5] p-4 mb-6 hover:scale-101 hover:shadow-sp w-full rounded-lg">
            <div class="flex items-center gap-2 font-inter">
                <div :class="[userProfile.bgColor, 'rounded-full w-8 h-8 flex items-center justify-center text-xl text-white']">{{ userProfile.initials }}</div>
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
