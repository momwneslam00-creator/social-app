import { useEffect, useRef, useState } from 'react'
import { Button, Card, Spinner } from '@heroui/react'
import { useFeed } from '../hooks/useFeed'
import { getErrorMessage } from '../api/axiosInstance'
import { CreatePostBox } from '../components/posts/CreatePostBox'
import { PostCard } from '../components/posts/PostCard'
import { PostSkeleton } from '../components/posts/PostSkeleton'
import type { FeedFilter } from '../types'

const FILTERS: { value: FeedFilter; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'following', label: 'المتابَعين' },
  { value: 'me', label: 'بوستاتي' },
]

export default function Home() {
  const [filter, setFilter] = useState<FeedFilter>('all')
  const { data, isPending, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useFeed(filter)

  // infinite scroll: load the next page when the sentinel becomes visible
  const sentinel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = sentinel.current
    if (!el || !hasNextPage) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage()
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const posts = data?.pages.flatMap((p) => p.data.posts) ?? []

  return (
    <div className="flex flex-col gap-4">
      <CreatePostBox />

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={filter === f.value ? 'primary' : 'secondary'}
            onPress={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {isPending && (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}

      {isError && (
        <Card className="items-center gap-3 p-6 text-center">
          <p>{getErrorMessage(error)}</p>
          <Button variant="secondary" onPress={() => refetch()}>
            إعادة المحاولة
          </Button>
        </Card>
      )}

      {!isPending && !isError && posts.length === 0 && (
        <Card className="p-8 text-center text-muted">لا توجد بوستات بعد</Card>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      <div ref={sentinel} className="flex h-10 items-center justify-center">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  )
}
