import axios from 'axios';
import { store } from '../config/store';  
import { loginUser, logoutUser } from '../features/userSlice';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;  
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response,  
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            try {
                const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/refresh-token`, null, {
                    withCredentials: true,  
                });

                if (data.accessToken) {
                    store.dispatch(loginUser(data.accessToken));
                    localStorage.setItem('token', data.accessToken);

                    originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                store.dispatch(logoutUser());
                localStorage.removeItem('token');
                window.location.href = '/login'
            }
        }

        return Promise.reject(error);
    }
);

export default api;
