import type {  } from '@/types';
import apiclient from './AxiosClient';


export default {
  getNews(limit: number = 100, page: number = 1) {
    return apiclient.get('/news', {
      params: {
        _limit: limit,
        _page: page
      }
    });
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
  },
  deleteComment(commentId: number) {
    return apiclient.delete(`/comments/${commentId}`);
  },
  deleteNews(newsId: number) {
  return apiclient.delete(`/news/${newsId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  });
},
};
