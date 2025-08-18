<script setup lang="ts">
  defineProps<{
    text: string
    isActive: boolean
  }>();
</script>


<template>
  <div class="cursor-pointer px-6 py-2 rounded-full inline-flex justify-center items-center" :class="{'bg-red-600': isActive, 'bg-neutral-100': !isActive}">
    <div class="justify-start font-medium font-inter" :class="{'text-white': isActive, 'text-neutral-600': !isActive}">{{ text }}</div>
  </div>
</template>
