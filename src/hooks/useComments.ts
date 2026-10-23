import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@heroui/react'
import {
  COMMENTS_LIMIT,
  createComment,
  deleteComment,
  extractComments,
  getComments,
  toggleCommentLike,
  updateComment,
} from '../api/comments.api'
import { getErrorMessage } from '../api/axiosInstance'
import type { CommentFormPayload } from '../types'

export function useComments(postId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) => getComments(postId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last, pages) =>
      extractComments(last).length >= COMMENTS_LIMIT ? pages.length + 1 : undefined,
  })
}

export function useCommentMutations(postId: string) {
  const qc = useQueryClient()
  const refresh = () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ['comments', postId] }),
      // comment counters live on the post
      qc.invalidateQueries({ queryKey: ['post', postId] }),
      qc.invalidateQueries({ queryKey: ['feed'] }),
    ])
  const onError = (e: unknown) => toast.danger(getErrorMessage(e))

  const create = useMutation({
    mutationFn: (p: CommentFormPayload) => createComment(postId, p),
    onSuccess: () => {
      toast.success('تم إضافة التعليق')
      return refresh()
    },
    onError,
  })

  const update = useMutation({
    mutationFn: ({ id, ...p }: CommentFormPayload & { id: string }) => updateComment(postId, id, p),
    onSuccess: () => {
      toast.success('تم تعديل التعليق')
      return refresh()
    },
    onError,
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteComment(postId, id),
    onSuccess: () => {
      toast.success('تم حذف التعليق')
      return refresh()
    },
    onError,
  })

  const like = useMutation({
    mutationFn: (id: string) => toggleCommentLike(postId, id),
    onSuccess: refresh,
    onError,
  })

  return { create, update, remove, like }
}
