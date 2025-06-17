import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const setCookie = (name, value) => {
    document.cookie = `${name}=${value}; path=/`;
};

const logoutUser = () => {
    document.cookie = 'acc=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'ref=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    window.location.href = '/logout';
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Attach token only if it exists
api.interceptors.request.use((config) => {
    const accessToken = getCookie('acc');
    if (!accessToken) {
        return config; // skip Authorization if no token
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
}, (error) => Promise.reject(error));

// Token refresh handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Do not retry auth endpoints
        if (originalRequest.url.includes('/api/v1/token')) {
            return Promise.reject(error);
        }

        // Don't retry if no refresh token exists
        const refreshToken = getCookie('ref');
        if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject: reject
                    });
                });
            }

            isRefreshing = true;

            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/token/refresh/`, {
                    refresh: refreshToken
                });

                const newAccessToken = res.data.access;
                setCookie('acc', newAccessToken);
                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                logoutUser();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;