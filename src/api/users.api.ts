import { api } from './axiosInstance'
import type {
  ApiResponse,
  AuthData,
  ChangePasswordPayload,
  SigninPayload,
  SignupPayload,
  User,
} from '../types'

export const signup = async (payload: SignupPayload) => {
  const { data } = await api.post<ApiResponse<AuthData>>('/users/signup', payload)
  return data
}

export const signin = async (payload: SigninPayload) => {
  const { data } = await api.post<ApiResponse<AuthData>>('/users/signin', payload)
  return data
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await api.patch<ApiResponse<{ token?: string }>>(
    '/users/change-password',
    payload,
  )
  return data
}

export const getProfile = async () => {
  const { data } = await api.get<ApiResponse<{ user: User }>>('/users/profile-data')
  return data
}

export const uploadPhoto = async (file: File) => {
  // form field name is not confirmed in the docs; "photo" is the most likely one
  const form = new FormData()
  form.append('photo', file)
  const { data } = await api.put<ApiResponse>('/users/upload-photo', form)
  return data
}
