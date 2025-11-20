import axios from "axios";
import { useUserStore } from "@/store/useUserStore";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    withCredentials: true,
});

// Attach JWT to every request
api.interceptors.request.use(
    (config) => {
        const token = useUserStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 (unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            useUserStore.getState().logout();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;