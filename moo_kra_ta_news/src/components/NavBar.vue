<script setup lang="ts">
import { getUserProfile } from '@/utils/userProfile';
import { Menu, MenuButton, MenuItem, MenuItems, Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/vue';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LogoWeb from './LogoWeb.vue';
import { Menu as MenuIcon, X, SquarePen } from 'lucide-vue-next';

const authStore = useAuthStore()

const user = computed(() => authStore.user)

const userProfile = computed(() => getUserProfile(authStore.currentUserFirstName|| ''));

</script>

<template>
  <Disclosure as="nav" v-slot="{ open }">
    <nav class="mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8 items-center justify-between h-16">
      <div class="flex items-center flex-col md:flex-row gap-5">
        <RouterLink to="/">
          <LogoWeb />
        </RouterLink>

        <div class="hidden md:flex md:flex-row md:justify-between md:items-center gap-3">
          <p>|</p>
          <div class="flex gap-6 md:text-sm font-medium text-gray-700">
            <RouterLink to="/">News</RouterLink>
            <RouterLink to="/">Trusted News</RouterLink>
            <RouterLink to="/">Fake News</RouterLink>
          </div>
        </div>
      </div>


      <!-- Right-side buttons: Sign in / Sign out -->
      <div class="hidden md:flex items-center" >
        <!-- Sign in and Sign up button shown when not logged in -->
        <div class="flex items-center gap-3" v-if="!authStore.currentUserFirstName">
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

      <div class="flex items-center gap-12">
        <RouterLink class="flex items-center gap-3" to="/Submit-news" v-if="authStore.isMember || authStore.isAdmin">
          <SquarePen :size="18" />
          <span class="text-sm text-gray-700">Write</span>
        </RouterLink>

        <div class="flex items-center justify-center " v-if="authStore.currentUserFirstName">
          <Menu as="div" class="relative">
            <MenuButton
              class="relative flex items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              <span class="sr-only">Open user menu</span>
              <img v-if="user?.image" :src="user.image" alt="User avatar"
                class="size-10 rounded-full outline outline-1 -outline-offset-1 outline-white/10" />

              <div v-else
                :class="[userProfile.bgColor, 'size-10 rounded-full flex items-center justify-center text-white text-xl font-semibold']">
                {{ userProfile.initials }}
              </div>
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
                <button @click="authStore.logout" type="button"
                  :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']">
                  Sign out
                </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
          </div>
        </div>
      </div>

      <div class="-mr-2 flex md:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-neutral-100 hover:text-neutral-600">
              <span class="absolute -inset-0.5"></span>
              <span class="sr-only">Open main menu</span>
              <MenuIcon v-if="!open" class="block size-6" aria-hidden="true" />
              <X v-else class="block size-6" aria-hidden="true" />
            </DisclosureButton>
      </div>
    </nav>

    <DisclosurePanel class="md:hidden bg-white border-red/10 border-y">
      <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3" v-if="!authStore.currentUserFirstName">
          <DisclosureButton :as="RouterLink" to="/login" class="block rounded-md px-3 py-2 text-base font-medium text-neutral-500 hover:bg-neutral-100 hover:text-black">
            Sign In
          </DisclosureButton>
          <DisclosureButton :as="RouterLink" to="/register" class="block rounded-md px-3 py-2 text-base font-medium text-neutral-500 hover:bg-neutral-100 hover:text-black">
            Sign Up
          </DisclosureButton>
          <!-- <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton> -->
        </div>
        <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3" v-if="authStore.currentUserFirstName">
          <DisclosureButton class="block rounded-md px-3 py-2 text-base font-medium text-neutral-500 hover:bg-neutral-100 hover:text-black">
            News
          </DisclosureButton>
          <DisclosureButton class="block rounded-md px-3 py-2 text-base font-medium text-neutral-500 hover:bg-neutral-100 hover:text-black">
            Trusted News
          </DisclosureButton>
          <DisclosureButton class="block rounded-md px-3 py-2 text-base font-medium text-neutral-500 hover:bg-neutral-100 hover:text-black">
            Fake News
          </DisclosureButton>
          <!-- <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton> -->
        </div>
        <div class="border-t border-red/10 pb-3 pt-4" v-if="authStore.currentUserFirstName">
          <div class="flex items-center px-5">
            <div class="shrink-0">
              <div
                :class="[userProfile.bgColor, 'size-10 rounded-full flex items-center justify-center text-white text-xl font-semibold']">
                {{ userProfile.initials }}
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base/5 font-medium text-black">{{ user!.firstname }} {{ user!.lastname }}</div>
              <div class="text-sm text-neutral-500">{{ user!.email }}</div>
            </div>
            <button type="button" class="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
              <span class="absolute -inset-1.5"></span>
              <span class="sr-only">View notifications</span>
              <BellIcon class="size-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-3 space-y-1 px-2">
            <DisclosureButton :as="RouterLink" to="/Submit-news" class="block rounded-md px-3 py-2 text-base text-neutral-500 hover:bg-neutral-100 hover:text-black">
              Write
            </DisclosureButton>
            <DisclosureButton v-if="authStore.isMember || authStore.isAdmin" :as="RouterLink" to="/UserProfile" class="block rounded-md px-3 py-2 text-base text-neutral-500 hover:bg-neutral-100 hover:text-black">
              User Profile
            </DisclosureButton>
            <DisclosureButton :as="RouterLink" @click="authStore.logout" class="block rounded-md px-3 py-2 text-base text-neutral-500 hover:bg-neutral-100 hover:text-black">
              Sign out
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
  </Disclosure>
</template>
