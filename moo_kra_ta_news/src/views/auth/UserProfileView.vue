<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { getUserProfile } from '@/utils/userProfile';
import { computed } from 'vue';
import AdminDropdown from '@/components/AdminDropdown.vue';

const authStore = useAuthStore()

const user = computed(() => authStore.user)

const userProfile = computed(() => getUserProfile(authStore.currentUserFirstName|| ''));

const handleAdminItemClick = (item: string) => {
  console.log('Admin item clicked:', item);
};

</script>
<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 relative">

     <div v-if="authStore.isAdmin" class="absolute top-9 right-10">
        <AdminDropdown @item-click="handleAdminItemClick" />
      </div>

      <div class="flex items-center space-x-6 border-b pb-6">
        <img
          v-if="user?.image"
          :src="user.image"
          alt="User avatar"
          class="w-24 h-24 rounded-full object-cover border-2 border-red-500"
        />
        <div v-else :class="[userProfile.bgColor, 'w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-semibold']">
          {{ userProfile.initials }}
        </div>

        <div>
          <h1 class="text-2xl font-semibold text-gray-800">
            {{ user?.firstname }} {{ user?.lastname }}
          </h1>
          <p class="text-gray-500 text-sm">{{ user?.email }}</p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-gray-100 p-4 rounded-lg">
          <h2 class="text-sm text-gray-500">First Name</h2>
          <p class="text-gray-800 font-medium">{{ user?.firstname }}</p>
        </div>

        <div class="bg-gray-100 p-4 rounded-lg">
          <h2 class="text-sm text-gray-500">Last Name</h2>
          <p class="text-gray-800 font-medium">{{ user?.lastname }}</p>
        </div>

        <div class="bg-gray-100 p-4 rounded-lg">
          <h2 class="text-sm text-gray-500">Email</h2>
          <p class="text-gray-800 font-medium">{{ user?.email }}</p>
        </div>

        <div class="bg-gray-100 p-4 rounded-lg">
          <h2 class="text-sm text-gray-500">Role(s)</h2>
          <div class="flex flex-wrap gap-2 mt-1">
            <span
              v-for="role in user?.roles"
              :key="role"
              class="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700"
            >
              {{ role.replace('ROLE_', '') }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-end">
        <button
          @click="authStore.logout()"
          class="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div> 
    </div>
  </div>
</template>