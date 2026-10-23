import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@heroui/react'
import { createPost, deletePost, toggleLike, updatePost } from '../api/posts.api'
import { getErrorMessage } from '../api/axiosInstance'
import type { PostFormPayload } from '../types'

export function usePostMutations() {
  const qc = useQueryClient()
  const refresh = () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ['feed'] }),
      qc.invalidateQueries({ queryKey: ['post'] }),
    ])
  const onError = (e: unknown) => toast.danger(getErrorMessage(e))

  const create = useMutation({
    mutationFn: (p: PostFormPayload) => createPost(p),
    onSuccess: () => {
      toast.success('تم نشر البوست')
      return refresh()
    },
    onError,
  })

  const update = useMutation({
    mutationFn: ({ id, ...p }: PostFormPayload & { id: string }) => updatePost(id, p),
    onSuccess: () => {
      toast.success('تم تعديل البوست')
      return refresh()
    },
    onError,
  })

  const remove = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      toast.success('تم حذف البوست')
      return refresh()
    },
    onError,
  })

  const like = useMutation({
    mutationFn: (id: string) => toggleLike(id),
    onSuccess: refresh,
    onError,
  })

  return { create, update, remove, like }
}
