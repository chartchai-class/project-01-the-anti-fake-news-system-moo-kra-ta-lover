<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';
import { useAuthStore } from './stores/auth';
const authStore = useAuthStore()
const token = localStorage.getItem('access_token')
const user = localStorage.getItem('user')
const router = useRouter()

if (token && user) {
  authStore.reload(token,JSON.parse(user))
  console.log('reloaded user from localStorage', authStore.user)
}else{
  logout()
}

function logout(){
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <NavBar />
  <RouterView />
</template>
