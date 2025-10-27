import type { User } from '@/types'
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { defineStore } from 'pinia'
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null
  }),

  getters: {
    currentUserFirstName(): string {
      return this.user?.firstname || ''
    },
    isAdmin(): boolean{
      return this.user?.roles.includes("ROLE_ADMIN") || false
    },
    isMember(): boolean{
      return this.user?.roles.includes("ROLE_MEMBER") || false
    },
    isReader(): boolean{
      return this.user?.roles.includes("ROLE_READER") || false
    },
    authorizationHeader(): string | null {
      return `Bearer ${this.token}`
    },
    currentImage(): string {
      return this.user?.image || ''
    },
  },

  actions: {
    login(email: string, password: string) {
      return apiClient
        .post('/api/v1/auth/authenticate', {
          email: email,
          password: password
        })
        .then((response) => {
          this.token = response.data.access_token
          console.log('token in store', this.token)
          this.user = response.data.user
          console.log('user in store', this.user)
          localStorage.setItem('access_token', this.token as string)
          localStorage.setItem('user', JSON.stringify(this.user))
          return response
        })
    },
    logout(){
      console.log('logout clicked')
      this.token = null
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    },
    reload(token : string, user: User) {
      this.token = token
      this.user = user
    },
    register(email: string, firstname: string, lastname: string, password: string, image: string) {
      return apiClient
        .post('/api/v1/auth/register', {
          firstname,
          lastname,
          email,
          password,
          image,
        })
    },
  }
})
