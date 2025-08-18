<script setup lang="ts">
import CommentItem from '@/components/CommentItem.vue';
</script>

<template>
    this is commentView
    <div>
        <CommentItem v-for="n in 10" :key="n"/>
    </div>
</template>