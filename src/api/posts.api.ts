import { api } from './axiosInstance'
import type { ApiResponse, FeedData, FeedFilter, Post, PostFormPayload } from '../types'

export const FEED_LIMIT = 10

export const getFeed = async (only: FeedFilter, page: number, limit = FEED_LIMIT) => {
  const { data } = await api.get<ApiResponse<FeedData>>('/posts/feed', {
    params: { only, page, limit },
  })
  return data
}

export const getPost = async (postId: string) => {
  // wrapper key (data.post vs data) is not confirmed yet; callers should handle both
  const { data } = await api.get<ApiResponse<{ post?: Post } & Partial<Post>>>(
    `/posts/${postId}`,
  )
  return data
}

function toFormData({ body, image }: PostFormPayload) {
  const form = new FormData()
  form.append('body', body)
  if (image) form.append('image', image)
  return form
}

export const createPost = async (payload: PostFormPayload) => {
  const { data } = await api.post<ApiResponse>('/posts', toFormData(payload))
  return data
}

export const updatePost = async (postId: string, payload: PostFormPayload) => {
  const { data } = await api.put<ApiResponse>(`/posts/${postId}`, toFormData(payload))
  return data
}

export const deletePost = async (postId: string) => {
  const { data } = await api.delete<ApiResponse>(`/posts/${postId}`)
  return data
}

export const toggleLike = async (postId: string) => {
  const { data } = await api.put<ApiResponse>(`/posts/${postId}/like`)
  return data
}
