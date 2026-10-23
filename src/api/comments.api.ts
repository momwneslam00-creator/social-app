import { api } from './axiosInstance'
import type { ApiResponse, Comment, CommentFormPayload } from '../types'

export const COMMENTS_LIMIT = 10

type CommentsData = { comments?: Comment[] } | Comment[]

/** The list may come back as data.comments or directly as data. */
export function extractComments(res: ApiResponse<CommentsData>): Comment[] {
  return Array.isArray(res.data) ? res.data : (res.data?.comments ?? [])
}

export const getComments = async (postId: string, page: number, limit = COMMENTS_LIMIT) => {
  const { data } = await api.get<ApiResponse<CommentsData>>(`/posts/${postId}/comments`, {
    params: { page, limit },
  })
  // TEMPORARY: helps confirm the real response shape on the first run
  if (page === 1) console.log('comments response', JSON.stringify(data).slice(0, 1500))
  return data
}

function toFormData({ content, image }: CommentFormPayload) {
  const form = new FormData()
  form.append('content', content)
  if (image) form.append('image', image)
  return form
}

export const createComment = async (postId: string, payload: CommentFormPayload) => {
  const { data } = await api.post<ApiResponse>(`/posts/${postId}/comments`, toFormData(payload))
  return data
}

export const updateComment = async (
  postId: string,
  commentId: string,
  payload: CommentFormPayload,
) => {
  const { data } = await api.put<ApiResponse>(
    `/posts/${postId}/comments/${commentId}`,
    toFormData(payload),
  )
  return data
}

export const deleteComment = async (postId: string, commentId: string) => {
  const { data } = await api.delete<ApiResponse>(`/posts/${postId}/comments/${commentId}`)
  return data
}

export const toggleCommentLike = async (postId: string, commentId: string) => {
  const { data } = await api.put<ApiResponse>(`/posts/${postId}/comments/${commentId}/like`)
  return data
}
