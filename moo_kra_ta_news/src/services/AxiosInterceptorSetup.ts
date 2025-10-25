import apiClient from '@/services/AxiosClient';

apiClient.interceptors.request.use(
    (request) => {
        const token = localStorage.getItem('access_token')
        console.log('token in interceptor', token)
        if(token) {
            request.headers['Authorization'] = 'Bearer ' + token
        }
        return request
    },
    (error) => {
        return Promise.reject(error)
    }
)