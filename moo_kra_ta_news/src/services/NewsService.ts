import type { News } from '@/types';
import apiclient from './AxiosClient';


export default {
  getNews() {
    // return apiClient.get('/news?_limit=' + perPage + '&_page=' + page);
    return apiclient.get('/news');
  },
  getNewsById(id: number) {
    return apiclient.get(`/news/`+id);
  },
  saveComment(newsId: number, comment: { 
    user: string; 
    vote: "Fake" | "Real"; 
    comment: string; 
    imageUrls?: string[] 
  }) {
    return apiclient.post('/comments', {
      ...comment,
      news: { id: newsId }
    });
  },
  saveNews(news: {topic: string ; shortDetail: string; fullDetail: string; reporter: string; reportDate: string; imageUrl?: string}) {
    return apiclient.post('/news', news);
  }
};
