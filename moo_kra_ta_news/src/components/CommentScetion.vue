<script lang="ts" setup>
import type { Comment } from '@/types'
import { ref, computed } from 'vue'
import { reactive } from 'vue'
import { storeToRefs } from 'pinia';
// const news = ref<News | null>(null)
import { useNewsStore } from '@/stores/news.ts'
import BaseInput from './BaseInput.vue';

const alertMessage = ref('')
const store = useNewsStore()

function showAlert(message: string) {
    alertMessage.value = message

    // disappear after 3 seconds
    setTimeout(() => {
        alertMessage.value = ''
    }, 3000)
}


function addComment() {
    if (!news.value) return

    if (!form.name.trim()) {
        showAlert("⚠️ Please enter your name.")
        return
    }

    if (!form.vote) {
        showAlert("⚠️ Please select Real or Fake.")
        return
    }

    if (!form.comment.trim()) {
        showAlert("⚠️ Please write a comment.")
        return
    }

    const newComment: Comment = {
        id: news.value.comments.length + 1,
        user: form.name,
        vote: form.vote,
        comment: form.comment,
        imageUrl: form.imageUrl ? [form.imageUrl] : []
    }

    store.addComment(newComment)

    // reset form
    form.name = ''
    form.comment = ''
    form.vote = 'Real'
    form.imageUrl = ''
    form.voted = false
}


const { news } = storeToRefs(store)

// single reactive form
const form = reactive({
    name: '',
    comment: '',
    vote: 'Real' as 'Real' | 'Fake', // optional if you want vote
    imageUrl: '', // optional
    voted: false
})

const totalComments = computed(() => news.value?.comments?.length || 0)

const comment = ref<Comment>({
    id: 0,
    user: '',
    vote: 'Real',
    comment: '',
    imageUrl: []
})

</script>

<template>
    <div>
        <div v-if="alertMessage" class="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 font-medium">
            {{ alertMessage }}
        </div>
        <div v-if="news">
            <div class="shadow-card hover:shadow-news transition-all duration-300">
                <div class="mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200">
                    <!-- head -->
                    <div class="flex items-center mb-4">
                        <svg class="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.526 0-2.947-.388-4.156-1.06L3 20l1.06-4.156C3.388 14.947 3 13.526 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h2 class="text-lg font-bold">Comments ( {{ totalComments }} )</h2>
                    </div>
                    <!-- comment box -->
                    <form @submit.prevent="addComment" class="space-y-3 mb-6">
                        <!-- Name -->
                        <div>
                            <BaseInput v-model="comment.user" type="text" label="Your Name" placeholder="Enter your name" />
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
                                <button type="button" @click="form.vote = 'Real'; form.voted = true"
                                    :class="form.vote === 'Real' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'"
                                    class="flex-1 py-2 rounded-md transform transition duration-500 hover:scale-105 active:scale-95 hover:shadow-md">
                                    Real
                                </button>

                                <button type="button" @click="form.vote = 'Fake'; form.voted = true"
                                    :class="form.vote === 'Fake' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'"
                                    class="flex-1 py-2 rounded-md transform transition duration-500 hover:scale-105 active:scale-95 hover:shadow-md">
                                    Fake
                                </button>

                            </div>
                        </div>


                        <!-- Comment -->
                        <div>

                            <BaseInput v-model="comment.comment" type="text" label="Comment" placeholder="Your comment" />

                        </div>

                        <!-- Image -->
                        <div>
                             <BaseInput v-model="comment.imageUrl" type="text" label="Image URL (optional)" placeholder="https://example.com/image.jpg" />
                        </div>
                        <!-- Submit button -->
                        <button type="submit"
                            class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                            Post Comment
                        </button>
                    </form>

                </div>
            </div>
        </div>
    </div>
</template>
