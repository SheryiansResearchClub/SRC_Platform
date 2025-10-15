import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
const isDev = import.meta.env.VITE_DEV === 'true'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isDev) {
      console.error('API error', error)
    }
    return Promise.reject(error)
  },
)

export default axiosInstance