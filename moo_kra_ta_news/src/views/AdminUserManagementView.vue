<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import NewsService from '@/services/NewsService'
import UserRoleDropdown from '@/components/UserRoleDropdown.vue'
import type { User } from '@/types'
import { useRouter } from 'vue-router'
const router = useRouter()

onMounted(() => {
  fetchUsers()
})

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref('')

const fetchUsers = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await NewsService.getAllUsers()
    users.value = response.data
    console.log('Users loaded:', users.value)
  } catch (err) {
    error.value = 'Failed to load users'
    console.error('Error fetching users:', err)
  } finally {
    isLoading.value = false
  }
}

const promoteToMember = async (userId: number) => {
  try {
    await NewsService.promoteToMember(userId)

    const userIndex = users.value.findIndex((user) => user.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex].roles = ['ROLE_MEMBER']
    }
  } catch (err) {
    console.error('Error promoting user:', err)
    router.push({ name: 'network-error-view' })
  }
}

const demoteToReader = async (userId: number) => {
  try {
    await NewsService.demoteToReader(userId)
    const userIndex = users.value.findIndex((user) => user.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex].roles = ['ROLE_READER']
    }
  } catch (err) {
    console.error('Error demoting user:', err)
    router.push({ name: 'network-error-view' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Back Button -->
      <router-link
        to="/UserProfile"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6 group hover:bg-gray-100 px-4 py-2 rounded-xl"
      >
        <span class="text-xl transform transition-all duration-200 group-hover:-translate-x-1">
          ←
        </span>
        <span class="font-medium">Back to Profile</span>
      </router-link>

      <!-- Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
          <p class="text-gray-600 mt-2">Manage user roles and permissions</p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-red-800">{{ error }}</span>
          </div>
          <button @click="fetchUsers" class="text-red-600 hover:text-red-800 text-sm font-medium">
            Try Again
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Table Header Stats -->
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Users ({{ users.length }})</h3>
            </div>
            <div class="flex gap-4 text-sm text-gray-600">
              <span
                >Admins:
                {{ users.filter((user) => user.roles.includes('ROLE_ADMIN')).length }}</span
              >
              <span
                >Members:
                {{ users.filter((user) => user.roles.includes('ROLE_MEMBER')).length }}</span
              >
              <span
                >Readers:
                {{ users.filter((user) => user.roles.includes('ROLE_READER')).length }}</span
              >
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Current Role
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="user in users"
                :key="user.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <!-- User Name -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <img
                        v-if="user?.image"
                        :src="user.image"
                        alt="User avatar"
                        class="size-10 rounded-full outline outline-1 -outline-offset-1 outline-white/10 object-cover"
                      />
                      <div
                        v-else
                        class="h-10 w-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      >
                        {{ user.firstname?.charAt(0) || '' }}{{ user.lastname?.charAt(0) || '' }}
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.firstname }} {{ user.lastname }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Email -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                </td>

                <!-- Roles -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="role in user.roles"
                      :key="role"
                      :class="[
                        'px-2 py-1 text-xs font-semibold rounded-full',
                        role === 'ROLE_ADMIN'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : role === 'ROLE_MEMBER'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200',
                      ]"
                    >
                      {{ role.replace('ROLE_', '') }}
                    </span>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <UserRoleDropdown
                    :user="user"
                    :on-promote-to-member="promoteToMember"
                    :on-demote-to-reader="demoteToReader"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="users.length === 0 && !isLoading" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p class="mt-1 text-sm text-gray-500">There are no users in the system.</p>
          <button
            @click="fetchUsers"
            class="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      </div>
    </div>
</template>
