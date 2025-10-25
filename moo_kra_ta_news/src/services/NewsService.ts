import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
});

export default {
  getNews() {
    // return apiClient.get('/news?_limit=' + perPage + '&_page=' + page);
    return apiClient.get('/news');
  },
  getNewsById(id: number) {
    return apiClient.get(`/news/`+id);
  },
  saveComment(newsId: number, comment: { 
    user: string; 
    vote: "Fake" | "Real"; 
    comment: string; 
    imageUrls?: string[] 
  }) {
    return apiClient.post('/comments', {
      ...comment,
      news: { id: newsId }
    });
  },
};
