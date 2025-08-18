import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://68a31457c5a31eb7bb1edde1.mockapi.io/',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
});

export default {
  getNews(perPage: number, page: number) {
    return apiClient.get('/news?_limit=' + perPage + '&_page=' + page);
  },
  getNewsById(id: number) {
    return apiClient.get(`/news/`+id);
  },
};
