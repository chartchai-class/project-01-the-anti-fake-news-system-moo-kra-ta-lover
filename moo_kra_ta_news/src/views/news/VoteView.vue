<script setup lang="ts">
import CommentScetion from '@/components/CommentScetion.vue';
</script>

<template>
  <div class="min-h-screen bg-gradient-subtle">
    <div class="container mx-auto px-4 py-8">
      <div class="space-y-8">
        <!-- Header -->
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-blue-600 ">
            News Verification Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-gray-500">
            Help the community verify news authenticity. Read, vote, and discuss to combat
            misinformation.
          </p>
        </div>

        <!-- News section -->
        
        
        <!-- comments -->
        <CommentScetion />
      </div>

    </div>
  </div>
</template>
