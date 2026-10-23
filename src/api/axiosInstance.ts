import axios, { AxiosError } from 'axios'
import type { ApiErrorResponse } from '../types'

export const BASE_URL = 'https://route-posts.routemisr.com'
export const TOKEN_KEY = 'social_token'
export const USER_KEY = 'social_user'

export const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiErrorResponse>) => {
    const hasToken = !!localStorage.getItem(TOKEN_KEY)
    if (error.response?.status === 401 && hasToken) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      window.dispatchEvent(new Event('auth:logout'))
    }
    return Promise.reject(error)
  },
)

/** Extracts a readable message from any API/network error. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data
    if (data?.message) return data.message
    if (typeof data?.errors === 'string') return data.errors
    if (Array.isArray(data?.errors) && data.errors.length) return data.errors[0]
    if (!error.response) return 'تعذر الاتصال بالسيرفر، تأكد من الإنترنت'
  }
  return 'حدث خطأ غير متوقع'
}
