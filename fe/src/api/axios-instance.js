import axios from "axios";
import { getToken, putAccessToken } from "../utils/local-storage";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


let isRefreshing = false;
let queue = [];

const processQueue = (error, newToken = null) => {
    queue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(newToken);
        }
    });
    queue = [];
};
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAuthRequest = originalRequest.url === "/auth";

        if (error.response?.status !== 401 || isAuthRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                queue.push({ resolve, reject });
            })
                .then((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axios.put(
                `${BASE_URL}/auth`,
                {},
                { withCredentials: true }
            );

            const newAccessToken = data.data.accessToken;
            putAccessToken(newAccessToken);

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            putAccessToken(null);
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);