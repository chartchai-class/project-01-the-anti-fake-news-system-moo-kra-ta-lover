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

  // In stores/newsFilter.ts
const filteredNews = computed(() => {
  let result;
  
  switch (activeFilter.value) {
    case 'trusted':
      result = allNews.value.filter(newsItem => {
        const realVotes = newsItem.comments?.filter(c => c.vote === 'Real').length || 0
        const fakeVotes = newsItem.comments?.filter(c => c.vote === 'Fake').length || 0
        if (realVotes === 0 && fakeVotes === 0) return true
        return realVotes > fakeVotes
      })
      break;

    case 'fake':
      result = allNews.value.filter(newsItem => {
        const realVotes = newsItem.comments?.filter(c => c.vote === 'Real').length || 0
        const fakeVotes = newsItem.comments?.filter(c => c.vote === 'Fake').length || 0
        return fakeVotes > realVotes
      })
      break;

    case 'all':
    default:
      result = allNews.value
      break;
  }
  
  // ✅ Sort by date (newest first)
  return result.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
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
