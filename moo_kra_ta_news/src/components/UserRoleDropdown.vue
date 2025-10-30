<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { User } from '@/types'

interface Props {
  user: User
  onPromoteToMember: (userId: number) => Promise<void>
  onDemoteToReader: (userId: number) => Promise<void>
}

const props = defineProps<Props>()
const openDropdown = ref(false)

// Role checking functions
const isReader = (user: User) => {
  return user.roles.length === 1 && user.roles.includes('ROLE_READER')
}

const isMember = (user: User) => {
  return user.roles.length === 1 && user.roles.includes('ROLE_MEMBER')
}

const isAdmin = (user: User) => {
  return user.roles.includes('ROLE_ADMIN')
}

const getRoleColor = (user: User) => {
  if (isAdmin(user)) return 'bg-purple-500'
  if (isMember(user)) return 'bg-green-500'
  return 'bg-gray-400'
}

const getCurrentRoleLabel = (user: User) => {
  if (isAdmin(user)) return 'Administrator'
  if (isMember(user)) return 'Member'
  if (isReader(user)) return 'Reader'
  return 'Multiple Roles'
}

// Toggle dropdown
const toggleDropdown = () => {
  openDropdown.value = !openDropdown.value
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (!(event.target as Element).closest('.relative')) {
    openDropdown.value = false
  }
}

// Handle role change
const handlePromoteToMember = async () => {
  await props.onPromoteToMember(props.user.id)
  openDropdown.value = false
}

const handleDemoteToReader = async () => {
  await props.onDemoteToReader(props.user.id)
  openDropdown.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative inline-block text-left">
    <!-- Dropdown Button -->
    <button
      @click.stop="toggleDropdown"
      class="inline-flex items-center justify-between w-full md:w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
    >
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full" :class="getRoleColor(user)"></span>
        <span>{{ getCurrentRoleLabel(user) }}</span>
      </div>
      <svg
        class="-mr-1 ml-2 h-4 w-4 transition-transform duration-200"
        :class="{ 'rotate-180': openDropdown }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="openDropdown"
      class="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-gray-200"
    >
      <div class="p-2">
        <!-- Role Options -->
        <div class="space-y-1">
          <!-- Promote to Member -->
          <button
            v-if="isReader(user)"
            @click="handlePromoteToMember"
            class="flex items-center justify-between w-full px-3 py-2 text-sm text-left rounded-md hover:bg-green-50 hover:text-green-700 transition-colors duration-150 group"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              <div>
                <p class="font-medium">Member</p>
                <p class="text-xs text-gray-500">Can create news articles</p>
              </div>
            </div>
            <svg
              class="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>

          <!-- Demote to Reader -->
          <button
            v-if="isMember(user)"
            @click="handleDemoteToReader"
            class="flex items-center justify-between w-full px-3 py-2 text-sm text-left rounded-md hover:bg-amber-50 hover:text-amber-700 transition-colors duration-150 group"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-gray-400"></div>
              <div>
                <p class="font-medium">Reader</p>
                <p class="text-xs text-gray-500">Read-only access</p>
              </div>
            </div>
            <svg
              class="w-4 h-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Admin (Disabled) -->
          <div
            v-if="isAdmin(user)"
            class="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 rounded-md bg-gray-50 cursor-not-allowed"
          >
            <div class="w-2 h-2 rounded-full bg-purple-500"></div>
            <div class="flex-1">
              <p class="font-medium">Administrator</p>
              <p class="text-xs">Full system access</p>
            </div>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
