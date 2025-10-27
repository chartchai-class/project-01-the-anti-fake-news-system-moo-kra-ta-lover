<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LogoWeb from './LogoWeb.vue';

const router = useRouter()
const authStore = useAuthStore()

function logout(){
  authStore.logout()
  router.push({ name: 'login' })
}


</script>

<template>
  <header>
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
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
      <div class="flex items-center" v-if="!authStore.currentUserFirstName">
        <!-- Sign in and Sign up button shown when not logged in -->
        <div class="flex items-center gap-3">
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
      </div>


      <div class="flex items-center gap-3" v-if="authStore.currentUserFirstName">
        <RouterLink to="/Submit-news">
          <button
            class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-xl transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg"
              viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
            </svg>
            Submit News
          </button>
        </RouterLink>


        <div class="flex items-center justify-center " v-if="authStore.currentUserFirstName">
          <Menu as="div" class="relative">
            <MenuButton
              class="relative flex items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              <span class="sr-only">Open user menu</span>
              <img class="size-10 rounded-full outline outline-1 -outline-offset-1 outline-white/10"
                :src=authStore.currentImage alt="User profile" />
            </MenuButton>

            <transition enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-1 outline-black/5">
                <MenuItem v-slot="{ active }">
                <RouterLink to="/UserProfile"
                  :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                  User Profile
                </RouterLink>
                </MenuItem>

                <MenuItem v-slot="{ active }">
                <button @click="logout" type="button"
                  :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']">
                  Sign out
                </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </nav>
  </header>
</template>