<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
import { useAuthStore } from './stores/auth';
const authStore = useAuthStore()
const token = localStorage.getItem('access_token')
const user = localStorage.getItem('user')

if (token && user) {
  try {
    const CurrentUser = JSON.parse(user)
    authStore.reload(token, CurrentUser)
    console.log('reloaded user from localStorage', authStore.user)
  } catch (error) {
    console.warn('Invalid user data in localStorage:', user ,error)
    authStore.logout()
  }
} else {
  authStore.logout()
}

</script>

<template>
  <NavBar />
  <RouterView />
</template>
