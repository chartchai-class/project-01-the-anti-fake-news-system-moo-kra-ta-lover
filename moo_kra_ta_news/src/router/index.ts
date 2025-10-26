import NewsService from '@/services/NewsService'
import { useAuthStore } from '@/stores/auth'
import { useNewsStore } from '@/stores/news'
import NetworkErrorView from '@/views/NetworkErrorView.vue'
import NewsCommentView from '@/views/news/CommentView.vue'
import NewsDetailView from '@/views/news/DetailView.vue'
import NewsVoteView from '@/views/news/VoteView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import nProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import NewsFormView from '@/views/news/NewsFormView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/new/:id/',
      name: 'news-detail-view',
      component: NewsDetailView,
      props: true,
      beforeEnter: (to) =>{
        //put api here
        const id = parseInt(to.params.id as string)
        const newsStore = useNewsStore()
        return NewsService.getNewsById(id)
        .then((reponse) =>{
          // need to setup data for the event
          newsStore.setNews(reponse.data)
          if (to.matched.length === 1 || to.name === 'news-detail-view') {
            return { name: 'news-comment-view', params: { id: id.toString() } }
          }
        }). catch ((error) =>{
          if (error.reponse && error.reponse.status === 404){
            return {
              name : '404-resource-view',
              params : { resource:'event' }
            }
          }else{
            return { name: 'network-error-view'}
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
      path: '/nerwork-error',
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
  ],
  scrollBehavior(to, from, savedPosition) {
    // If using browser back/forward, restore old position
    if (savedPosition) {
      return savedPosition
    }
    // Otherwise always scroll to top
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
    next({ path: '/login' }); // redirect if not logged in
  } else {
    next(); // allow navigation
  }
});


export default router
