import apiClient from "./axios";

export const logIn = async (formData) => {
    const response = await apiClient.post('/login', formData);
    return response.data
}