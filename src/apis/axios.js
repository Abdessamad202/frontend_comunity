import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://backend_comunity_app.test/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // cors
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        // "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const token = user.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;