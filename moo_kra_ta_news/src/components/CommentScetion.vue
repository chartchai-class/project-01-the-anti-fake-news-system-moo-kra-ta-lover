<script lang="ts" setup>
import type { News } from '@/types'
import { ref } from 'vue'
import { reactive } from 'vue'
// const news = ref<News | null>(null)


const news = ref<News | null>({
    id: 1,
    topic: 'Example News',
    shortDetail: 'Short detail here',
    fullDetail: 'Full detail here',
    reporter: 'John Doe',
    reportDate: '2025-08-19',
    imageUrl: [],
    comments: []
})

// single reactive form
const form = reactive({
    name: '',
    comment: '',
    vote: 'Real' as 'Real' | 'Fake', // optional if you want vote
    imageUrl: '', // optional
    voted: false
})

function addComment() {
    if (!news.value) return

    const newComment: Comment = {
        id: news.value.comments.length + 1,
        user: form.name,
        vote: form.vote,
        comment: form.comment,
        imageUrl: form.imageUrl ? [form.imageUrl] : []
    }

    news.value.comments.push(newComment)

    // reset form
    form.name = ''
    form.comment = ''
    form.vote = 'Real'
    form.imageUrl = ''
    form.voted = false
}


</script>

<template>
    <div>
        <div v-if="news">
            <div class="shadow-card hover:shadow-news transition-all duration-300">
                <div class="mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200">
                    <!-- head -->
                    <div class="flex items-center mb-4">
                        <svg class="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.526 0-2.947-.388-4.156-1.06L3 20l1.06-4.156C3.388 14.947 3 13.526 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h2 class="text-lg font-bold">Comments ( {{ news.comments.length }} )</h2>
                    </div>
                    <!-- comment box -->
                    <form @submit.prevent="addComment" class="space-y-3 mb-6">
                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                            <input v-model="form.name" type="text" placeholder="Enter your name"
                                class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
                        </div>
                        <!-- Vote -->
                        <div>
                            <div class="text-center mb-4">
                                <h2 class="text-2xl font-bold mb-2">What do you think?</h2>
                                <p class="text-muted-foreground">
                                    {{ form.voted ? "Thank you for your vote!" : "Vote to help verify this news article"
                                    }}
                                </p>
                            </div>


                            <div class="flex gap-4 max-w-md mx-auto">
                                <button
  type="button"
  @click="form.vote = 'Real'; form.voted = true"
  :class="form.vote === 'Real' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'"
  class="flex-1 py-2 rounded-md transform transition duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
>
  Real
</button>

<button
  type="button"
  @click="form.vote = 'Fake'; form.voted = true"
  :class="form.vote === 'Fake' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'"
  class="flex-1 py-2 rounded-md transform transition duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
>
  Fake
</button>

                            </div>
                        </div>


                        <!-- Comment -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                            <textarea v-model="form.comment" rows="3" placeholder="Your comment"
                                class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>

                        <!-- Image -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                            <input v-model="form.imageUrl" type="url" placeholder="https://example.com/image.jpg"
                                class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <!-- Submit button -->
                        <button type="submit"
                            class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                            Post Comment
                        </button>
                    </form>

                    <!-- comments list -->
                    <div v-if="news.comments.length > 0" class="space-y-3">
                        <div v-for="comment in news.comments" :key="comment.id" class="border p-3 rounded-md">
                            <p class="font-semibold">{{ comment.user }} <span class="text-sm text-gray-500">({{
                                comment.vote }})</span></p>
                            <p class="mt-1">{{ comment.comment }}</p>
                            <img v-if="comment.imageUrl.length" :src="comment.imageUrl[0]" alt="comment image"
                                class="mt-2 rounded-md max-h-60 object-cover w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
