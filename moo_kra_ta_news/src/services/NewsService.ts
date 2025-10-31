import type { News } from '@/types';
import apiclient from './AxiosClient';
import type { AxiosResponse } from 'axios';


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
  getNewsByKeyword(keyword: string): Promise<AxiosResponse<News[]>> {
    return apiclient.get<News[]>('/news?detail=' + keyword)
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
  getAdminNews(){
    return apiclient.get('/admin/news');
  },
  getAdminComments(){
    return apiclient.get('/admin/comments');
  },
  deleteNews(newsId: number) {
  return apiclient.delete(`/news/${newsId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  });
  },
  getAllUsers() {
    return apiclient.get('/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
  },
  promoteToMember(userId: number) {
    return apiclient.put(`/users/${userId}/promote-to-member`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
  },
  demoteToReader(userId: number) {
    return apiclient.put(`/users/${userId}/demote-to-reader`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
  }
};
