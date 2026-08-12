import axios from 'axios'

// Central axios instance. Uses httpOnly cookies via withCredentials so the
// server owns session/token handling (no token stored in localStorage).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - placeholder for attaching correlation ids / headers.
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor - normalize errors into a predictable shape.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = {
      status: error?.response?.status ?? null,
      message:
        error?.response?.data?.message ||
        error?.message ||
        '發生未預期的錯誤，請稍後再試',
      data: error?.response?.data ?? null,
      original: error
    }
    return Promise.reject(normalized)
  }
)

export default api
