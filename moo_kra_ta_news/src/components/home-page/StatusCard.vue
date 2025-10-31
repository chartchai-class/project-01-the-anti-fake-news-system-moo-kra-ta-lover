<script setup lang="ts">
  defineProps<{
    text: string
    isReal: boolean
    isUnvoted?: boolean
  }>();
</script>

<template>
  <div class="px-3 py-1 rounded-full inline-flex justify-center items-center absolute top-4 left-3" :class="{'bg-green-600': isReal, 'bg-red-600': !isReal && !isUnvoted, 'bg-gray-500': isUnvoted}">
    <div class="justify-start font-medium font-inter text-white">{{ text }}</div>
  </div>
</template>
