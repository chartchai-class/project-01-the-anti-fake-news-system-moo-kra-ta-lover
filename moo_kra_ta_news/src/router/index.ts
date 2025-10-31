import NewsService from '@/services/NewsService'
import { useAuthStore } from '@/stores/auth'
import { useNewsStore } from '@/stores/news'
import { useNewsFilterStore } from '@/stores/newsFilter'
import UserProfileView from '@/views/auth/UserProfileView.vue'
import NetworkErrorView from '@/views/NetworkErrorView.vue'
import NewsCommentView from '@/views/news/CommentView.vue'
import NewsDetailView from '@/views/news/DetailView.vue'
import NewsFormView from '@/views/news/NewsFormView.vue'
import NewsVoteView from '@/views/news/VoteView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import nProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import AdminUserManagementView from '@/views/AdminUserManagementView.vue'
import AdminHistoryManagementView from '@/views/AdminHistoryManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
      beforeEnter: async () => {
        const newsFilterStore = useNewsFilterStore()
        newsFilterStore.setFilter('all')
        try {
          const response = await NewsService.getNews()
          newsFilterStore.setNews(response.data)
        } catch (error) {
          console.error('Failed to load news:', error)
        }
      }
    },
    {
      path: '/news/trusted',
      name: 'trusted-news',
      component: HomeView,
      meta: { requiresAuth: true },
      beforeEnter: async () => {
        const newsFilterStore = useNewsFilterStore()
        newsFilterStore.setFilter('trusted')
        try {
          const response = await NewsService.getNews()
          newsFilterStore.setNews(response.data)
        } catch (error) {
          console.error('Failed to load news:', error)
        }
      }
    },
    {
      path: '/news/fake',
      name: 'fake-news',
      component: HomeView,
      meta: { requiresAuth: true },
      beforeEnter: async () => {
        const newsFilterStore = useNewsFilterStore()
        newsFilterStore.setFilter('fake')
        try {
          const response = await NewsService.getNews()
          newsFilterStore.setNews(response.data)
        } catch (error) {
          console.error('Failed to load news:', error)
        }
      }
    },
    {
      path: '/news/unvoted',
      name: 'unvoted-news',
      component: HomeView,
      meta: { requiresAuth: true },
      beforeEnter: async () => {
        const newsFilterStore = useNewsFilterStore()
        newsFilterStore.setFilter('unvoted')
        try {
          const response = await NewsService.getNews()
          newsFilterStore.setNews(response.data)
        } catch (error) {
          console.error('Failed to load news:', error)
        }
      }
    },
    {
      path: '/new/:id/',
      name: 'news-detail-view',
      component: NewsDetailView,
      props: true,
      beforeEnter: (to) => {
        const id = parseInt(to.params.id as string)
        const newsStore = useNewsStore()
        return NewsService.getNewsById(id)
          .then((response) => {
            newsStore.setNews(response.data)
            if (to.matched.length === 1 || to.name === 'news-detail-view') {
              return { name: 'news-comment-view', params: { id: id.toString() } }
            }
          }).catch((error) => {
            if (error.response && error.response.status === 404) {
              return {
                name: '404-resource-view',
                params: { resource: 'event' }
              }
            } else {
              return { name: 'network-error-view' }
            }
          })
      },
      children: [
        {
          path: '',
          name: 'news-comment-view',
          component: NewsCommentView,
          props: true,
        },
        {
          path: 'vote',
          name: 'news-vote-view',
          component: NewsVoteView,
          props: true,
        }
      ],
    },
    {
      path: '/404/:resource',
      name: '404-resource-view',
      component: NotFoundView,
      props: true,
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
    {
      path: '/network-error',
      name: 'network-error-view',
      component: NetworkErrorView,
    },
    {
      path: '/Login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/Register',
      name: 'Register',
      component: RegisterView,
    },
    {
      path: '/Submit-news',
      name: 'Submit-news',
      component: NewsFormView,
    },
    {
      path: '/UserProfile',
      name: 'User-profile-view',
      component: UserProfileView,
    },
    {
      path: '/adminUserManagement',
      name: 'admin-user-management',
      component: AdminUserManagementView,
    },
    {
      path: '/adminHistoryManagement',
      name: 'admin-history-management',
      component: AdminHistoryManagementView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.beforeEach(() => {
  nProgress.start()
})

router.afterEach(() => {
  nProgress.done()
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.currentUserFirstName) {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router
