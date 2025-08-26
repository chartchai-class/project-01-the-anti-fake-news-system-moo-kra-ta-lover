<script setup lang="ts">
import { RouterLink } from 'vue-router';
import LogoWeb from './LogoWeb.vue';
</script>

<template>
  <header>
    <nav class="mx-auto flex max-w-7xl items-center justify-center md:justify-between p-6 lg:px-8">

      <div class="flex items-center flex-col md:flex-row gap-5">
        <RouterLink to="/">
          <LogoWeb />
        </RouterLink>

        <p class="hidden md:block">|</p>

        <div class="flex gap-6">
            <p>News</p>
            <p>Trusted News</p>
            <p>Fake News</p>
        </div>
      </div>
    </nav>
  </header>
</template>
