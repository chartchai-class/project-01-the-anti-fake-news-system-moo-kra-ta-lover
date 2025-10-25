<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LogoWeb from './LogoWeb.vue';


const authStore = useAuthStore()


function signOut() {
  console.log('Signing up...');
}
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

      <!-- Right-side buttons: Sign in / Sign out -->
      <div class="flex items-center">
        <!-- Sign in and Sign up button shown when not logged in -->
        <div v-if="!authStore.currentUserFirstName" class="flex items-center gap-3">
          <div
            class="rounded-full px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 shadow">
            <router-link to="/logIn">
              <button>
                Sign in
              </button>
            </router-link>
          </div>

          <div
            class="rounded-full px-4 py-2 text-sm font-medium bg-[#DD0B12] border border-gray-300 text-white hover:bg-[#af0000] shadow">
            <router-link to="/register">
              <button>
                Sign Up
              </button>
            </router-link>
          </div>
        </div>

        <div v-if="authStore.currentUserFirstName" class="flex items-center gap-3">
          <!-- Sign out shown when logged in -->
          <button @click="signOut"
            class="rounded-full px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 shadow">
            Sign out
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>
