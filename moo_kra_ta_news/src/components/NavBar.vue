<script setup lang="ts">
import { RouterLink } from 'vue-router';
import LogoWeb from './LogoWeb.vue';
</script>

<template>
  <header>
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">

      <div class="flex items-center gap-5">
        <RouterLink to="/">
          <LogoWeb />
        </RouterLink>

        <p>|</p>

        <div class="flex gap-6">
            <p>News</p>
            <p>Trusted News</p>
            <p>Fake News</p>
        </div>
      </div>
    </nav>
  </header>
</template>
