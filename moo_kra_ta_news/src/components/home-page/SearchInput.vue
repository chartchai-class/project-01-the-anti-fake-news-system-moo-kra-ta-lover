<script setup lang="ts">
import { ref } from 'vue';
const searchTerm = ref('');

function performSearch() {
  console.log('Searching for:', searchTerm.value);
}
</script>

<template>
  <div class="w-full flex gap-2 items-center justify-center">
    <input class="w-1/2 border border-gray-300 rounded-full p-2 bg-neutral-100 px-4" v-model="searchTerm" placeholder="Search any news that suit you" />
    <button class="rounded-full px-4 py-2 text-sm font-medium bg-red-600 border border-gray-300 text-white hover:bg-red-700 shadow" @click="performSearch">Search</button>
  </div>
</template>
