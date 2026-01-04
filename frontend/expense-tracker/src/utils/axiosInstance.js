import axios from "axios";
import { BASE_URL } from "./apiPaths.js";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    },
})

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response Interceptor
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response) {
            if(error.response.status === 401) {
                window.location.href = "/login";
            } else if(error.response.status === 500) {
                console.error("Server error. Please try again later.");
            }
        } else if(error.code === "ECONNABORTED") {
            console.error("Request timed out. Please try again later.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;