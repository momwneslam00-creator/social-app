import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Spinner } from '@heroui/react'
import { ArrowRight } from 'lucide-react'
import { getPost } from '../api/posts.api'
import { extractComments } from '../api/comments.api'
import { getErrorMessage } from '../api/axiosInstance'
import { useCommentMutations, useComments } from '../hooks/useComments'
import { PostCard } from '../components/posts/PostCard'
import { PostSkeleton } from '../components/posts/PostSkeleton'
import { CommentForm } from '../components/comments/CommentForm'
import { CommentItem } from '../components/comments/CommentItem'
import type { Post } from '../types'

export default function PostDetails() {
  const { postId = '' } = useParams()

  const postQuery = useQuery({ queryKey: ['post', postId], queryFn: () => getPost(postId) })
  const comments = useComments(postId)
  const { create } = useCommentMutations(postId)

  // the single-post payload may be data.post or data itself
  const raw = postQuery.data?.data
  const post = (raw?.post ?? (raw?._id ? raw : undefined)) as Post | undefined
  const list = comments.data?.pages.flatMap(extractComments) ?? []

  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="flex w-fit items-center gap-2 text-muted hover:text-foreground">
        <ArrowRight size={18} /> الرجوع
      </Link>

      {postQuery.isPending && <PostSkeleton />}

      {postQuery.isError && (
        <Card className="items-center gap-3 p-6 text-center">
          <p>{getErrorMessage(postQuery.error)}</p>
          <Button variant="secondary" onPress={() => postQuery.refetch()}>
            إعادة المحاولة
          </Button>
        </Card>
      )}

      {post && (
        <>
          <PostCard post={post} detailed />

          <Card className="gap-4 p-4">
            <h2 className="font-bold">التعليقات ({post.commentsCount})</h2>

            <CommentForm
              isPending={create.isPending}
              onSubmit={(payload, reset) => create.mutate(payload, { onSuccess: reset })}
            />

            {comments.isPending && (
              <div className="flex justify-center p-4">
                <Spinner />
              </div>
            )}
            {comments.isError && <p className="text-danger">{getErrorMessage(comments.error)}</p>}
            {!comments.isPending && list.length === 0 && (
              <p className="py-4 text-center text-muted">لا توجد تعليقات بعد. كن أول من يعلّق!</p>
            )}

            <div className="flex flex-col gap-4">
              {list.map((c) => (
                <CommentItem key={c._id} comment={c} postId={post._id} postOwnerId={post.user._id} />
              ))}
            </div>

            {comments.hasNextPage && (
              <Button
                variant="secondary"
                isPending={comments.isFetchingNextPage}
                onPress={() => comments.fetchNextPage()}
              >
                عرض المزيد من التعليقات
              </Button>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
