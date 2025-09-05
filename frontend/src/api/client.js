import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// Ensure CSRF cookie for Sanctum before any state-changing request
export async function ensureCsrf() {
    try { await api.get("/sanctum/csrf-cookie"); } catch { }
}
