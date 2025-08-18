import VoteView from '@/views/news/VoteView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailView from '../views/news/DetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:id',
      name: 'detail',
      component: DetailView,
      props: true,
      beforeEnter: () => {
      }
    },
    {
      path: '/vote',
      name: 'vote',
      component: VoteView
    },
  ],
})

export default router
