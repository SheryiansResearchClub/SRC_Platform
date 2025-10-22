import axios from 'axios'
import { store } from '@/config/store'
import { logout as logoutAction, setAuthError, setAuthState } from '@/features/auth/slices/authSlice'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'
const isDev = import.meta.env.VITE_DEV === 'true'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let refreshSubscribers = []

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback)
}

const notifySubscribers = (success, error) => {
  refreshSubscribers.forEach((callback) => callback(success, error))
  refreshSubscribers = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error ?? {}

    if (isDev) {
      console.error('API error', error)
    }

    if (!response || response.status !== 401 || config?._retry) {
      return Promise.reject(error)
    }

    if (config?.url?.includes('/auth/refresh-token')) {
      return Promise.reject(error)
    }

    if (config?.skipAuthRefresh) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((success, refreshError) => {
          if (success) {
            resolve(axiosInstance(config))
          } else {
            reject(refreshError)
          }
        })
      })
    }

    config._retry = true
    isRefreshing = true

    try {
      const refreshResponse = await refreshClient.post('/auth/refresh-token')
      const payload = refreshResponse?.data?.data ?? {}

      if (payload?.user) {
        store.dispatch(setAuthState({ user: payload.user }))
      }

      notifySubscribers(true)

      return axiosInstance(config)
    } catch (refreshError) {
      notifySubscribers(false, refreshError)

      store.dispatch(logoutAction())
      store.dispatch(setAuthError('Session expired. Please sign in again.'))

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default axiosInstance