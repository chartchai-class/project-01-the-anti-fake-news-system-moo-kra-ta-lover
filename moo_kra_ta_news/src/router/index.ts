import NewsService from '@/services/NewsService'
import { useNewsStore } from '@/stores/news'
import NetworkErrorView from '@/views/NetworkErrorView.vue'
import NewsCommentView from '@/views/news/CommentView.vue'
import NewsDetailView from '@/views/news/DetailView.vue'
import NewsVoteView from '@/views/news/VoteView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
          path: '',
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
  path: '/new/:id/vote',
  name: 'news-vote-view',
  component: NewsVoteView,
  props: true,
},
  ],
})

export default router
