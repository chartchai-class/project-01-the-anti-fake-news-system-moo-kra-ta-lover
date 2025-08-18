import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://my-json-server.typicode.com/Eakkasit662115058/Moo_Kra_ta_news_database',
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
