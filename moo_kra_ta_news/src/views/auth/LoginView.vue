<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useMessageStore } from '@/stores/message';
import { storeToRefs } from 'pinia';
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import InputText from '../../components/InputText.vue';



const messageStore = useMessageStore()

const { message } = storeToRefs(messageStore)

const router = useRouter()

const authStore = useAuthStore()

const validationSchema = yup.object({
  email: yup.string().required('The email is required'),
  password: yup.string().required('The password is required')
})
const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    password: ''
  }
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit((values) => {
  authStore.login(values.email, values.password)
  .then(() => {
    console.log('Login successful')
    router.push({ name: 'home' })   
  })
  .catch((error) => {
    messageStore.updateMessage('Login failed. Please check your credentials and try again.')
    setTimeout(() => {
      messageStore.resetMessage()
    }, 3000)
    console.log('Login failed', error) 
  });
})

import { ref, watch } from 'vue';

const showFade = ref(false)

watch(message, (newVal) => {
  if (newVal) {
    showFade.value = false // pop animation
    setTimeout(() => {
      showFade.value = true // start fade-out
      setTimeout(() => {
        messageStore.resetMessage()
        showFade.value = false
      }, 1000) // fade duration
    }, 2000) // visible duration
  }
})


</script>
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-16 w-auto" src="../../assets/logo.png" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent='onSubmit'>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <InputText type="email" v-model="email" placeholder="Email address" :error="errors['email']" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <InputText type="password" v-model="password" placeholder="Password" :error="errors['password']" />
          </div>
        </div>

        <div class="space-y-4">
          <div v-if="message"
            :class="['w-full max-w-sm mx-auto rounded-lg bg-red-600 px-6 py-3 text-white text-center shadow-lg', showFade ? 'animate-fadeOut' : 'animate-pop']">
            <p class="text-sm font-medium">{{ message }}</p>
          </div>

          <div>
            <button type="submit"
              class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Sign in
            </button>
          </div>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Not a member?
        <router-link to="/register">
          <a class="font-semibold text-red-600 hover:text-red-500">Register Now!</a>
        </router-link>
      </p>
    </div>
  </div>
</template>