import type { News, NewsState, Comment } from '@/types'
import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    news: null
  }),
  actions: {
    setNews(news: News): void {
      this.news = news
    },
    clearNews(): void {
      this.news = null
    },
    addComment(comment: Comment): void {
      if (this.news) {
        this.news.comments.push(comment)
      }
    }
  }
})
