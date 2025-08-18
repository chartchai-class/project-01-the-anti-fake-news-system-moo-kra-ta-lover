import {ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { News } from '@/types'

export type FilterType = 'all' | 'trusted' | 'fake'

export const useNewsFilterStore = defineStore('newsFilter', () => {
  const activeFilter = ref<FilterType>('all')
  const allNews = ref<News[]>([])


  function setFilter(filter: FilterType) {
    activeFilter.value = filter
  }

  function setNews(news: News[]) {
    allNews.value = news
  }

  const filteredNews = computed(() => {
    switch (activeFilter.value) {
      case 'trusted':
        return allNews.value.filter(newsItem => {
          const realVotes = newsItem.comments?.filter(c => c.vote === 'Real').length || 0
          const fakeVotes = newsItem.comments?.filter(c => c.vote === 'Fake').length || 0
          return realVotes > fakeVotes
        })

      case 'fake':
        return allNews.value.filter(newsItem => {
          const realVotes = newsItem.comments?.filter(c => c.vote === 'Real').length || 0
          const fakeVotes = newsItem.comments?.filter(c => c.vote === 'Fake').length || 0
          return fakeVotes > realVotes
        })

      case 'all':
      default:
        return allNews.value
    }
  })

  const newsCount = computed(() => ({
    all: allNews.value.length,
    trusted: allNews.value.filter(newsItem => {
      const realVotes = newsItem.comments?.filter(c => c.vote === 'Real').length || 0
      const fakeVotes = newsItem.comments?.filter(c => c.vote === 'Fake').length || 0
      return realVotes > fakeVotes
    }).length,
    fake: allNews.value.filter(newsItem => {
      const realVotes = newsItem.comments?.filter(c => c.vote === 'Real').length || 0
      const fakeVotes = newsItem.comments?.filter(c => c.vote === 'Fake').length || 0
      return fakeVotes > realVotes
    }).length
  }))

  return { activeFilter, allNews, setFilter, setNews, filteredNews, newsCount }
})
