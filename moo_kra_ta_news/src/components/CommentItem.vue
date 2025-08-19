<script setup lang="ts">
import type { Comment } from '@/types';
import { getUserProfile } from '@/utils/userProfile';
import { Check, TriangleAlert } from 'lucide-vue-next';
import { computed } from 'vue';
const props = defineProps<{
  comment: Comment;
}>();

const userProfile = computed(() => getUserProfile(props.comment.user|| ''));
</script>


<template>
    <div>
        <div class="border border-grey-600 bg-[#F5F5F5] p-4 mb-6 hover:scale-101 hover:shadow-sp w-full rounded-lg">
            <div class="flex items-center justify-between font-inter">
                <div class="flex items-center gap-2 font-inter">
                    <div :class="[userProfile.bgColor, 'rounded-full w-8 h-8 flex items-center justify-center text-xl text-white']">
                        {{ userProfile.initials }}
                    </div>
                    <span>{{ comment.user }}</span>
                </div>
                <div class="h-8 w-24 rounded-full flex items-center justify-center gap-2" :class="comment.vote === 'Real' ? 'bg-[#E8F5EC]' : 'bg-[#F5E8E8]'">
                    <div v-if="comment.vote === 'Real'">
                        <Check />
                    </div>
                    <div v-if="comment.vote === 'Fake'">
                        <TriangleAlert />
                    </div>
                    <span :class="comment.vote === 'Real' ? 'text-[#2E9B40]' : 'text-[#9B2E30]'">{{ comment.vote }}</span>
                </div>
            </div>
            
            <div v-if="comment.imageUrl && comment.imageUrl.length > 0" class="mt-6 flex flex-wrap gap-4">
                <div 
                    v-for="(image, index) in comment.imageUrl" :key="index" class="w-64 h-64 rounded-xl overflow-hidden items-center justify-center mb-4 flex">
                    <img 
                        :src="image" 
                        :alt="`News Image ${index}`" 
                        class="w-full h-full object-fill"
                    />
                </div>
            </div>
            <div class="mt-6 font-inter text-lg">
                {{ comment.comment }}
            </div>

        </div>
    </div>

</template>
