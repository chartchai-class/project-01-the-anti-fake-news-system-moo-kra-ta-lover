<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { CircleUserRound } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import InputText from '../../components/InputText.vue';
import { useMessageStore } from '../../stores/message';

const messageStore = useMessageStore()

const router = useRouter()

const authStore = useAuthStore()

const { message } = storeToRefs(messageStore)

const validationSchema = yup.object({
  email: yup.string().required('The email is required'),
  password: yup.string().required('The password is required')
})
const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    image: ''
  }
})

const { value: email } = useField<string>('email')
const { value: firstName } = useField<string>('firstName')
const { value: lastName } = useField<string>('lastName')
const { value: image } = useField<string>('image')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit((values) => {
  authStore.register(values.email, values.firstName, values.lastName,values.password,values.image)
  .then(() => {
    console.log('Register successful')
    router.push({ name: 'login' })
  })
  .catch((error) => {
    messageStore.updateMessage('Register failed. Please try again Later.')
    setTimeout(() => {
      messageStore.resetMessage()
    }, 3000)
    console.log('Register failed', error)
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
  <div class="mx-auto max-w-2xl">
    <form @submit.prevent='onSubmit'>
      <div class="sm:max-w-sm flex flex-col items-start">
      <img class="h-12" src="../../assets/logo.png" alt="Your Company" />
      <h2 class="mb-8 mt-3 text-2xl/9 font-bold tracking-tight text-gray-900">Create new account</h2>
    </div>
      <div>
        <h2 class="text-base/7 font-semibold text-gray-900">Profile</h2>
        <p class="mt-2 text-sm/6 text-gray-600">This information will be displayed publicly so be careful what you
          share.</p>
      </div>
      <div class="space-y-8">
        <div class="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="first-name" class="block text-sm/6 font-medium text-gray-900">First name</label>
            <div class="mt-2">
              <InputText type="text" v-model="firstName" placeholder="First Name" :error="errors['firstName']" />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="last-name" class="block text-sm/6 font-medium text-gray-900">Last name</label>
            <div class="mt-2">
              <InputText type="text" v-model="lastName" placeholder="last Name" :error="errors['lastName']" />
            </div>
          </div>

        </div>

        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900">Email</label>
            <div class="mt-2">
              <InputText type="email" v-model="email" placeholder="Example.email.com" :error="errors['email']" />
            </div>
          </div>

          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-gray-900">Password</label>
            <div class="mt-2">
              <InputText type="password" v-model="password" placeholder="Password" :error="errors['password']" />
            </div>
          </div>


          <div class="col-span-full">
            <label for="photo" class="block text-sm/6 font-medium text-gray-900">Photo</label>
            <div class="mt-2 flex items-center gap-x-3">
              <CircleUserRound class="size-12 text-gray-300" aria-hidden="true" />
              <button type="button"
                class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change</button>
            </div>
          </div>

        </div>
      </div>


      <div v-if="message"
            :class="['w-full max-w-sm mx-auto rounded-lg bg-red-600 px-6 py-3 text-white text-center shadow-lg', showFade ? 'animate-fadeOut' : 'animate-pop']">
            <p class="text-sm font-medium">{{ message }}</p>
          </div>

      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-sm/6 font-semibold text-gray-900">Cancel</button>
        <button type="submit"
          class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
      </div>
    </form>
  </div>
</template>
