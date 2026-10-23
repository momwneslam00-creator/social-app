import { useInfiniteQuery } from '@tanstack/react-query'
import { FEED_LIMIT, getFeed } from '../api/posts.api'
import type { FeedFilter } from '../types'

export const feedKey = (only: FeedFilter) => ['feed', only] as const

export function useFeed(only: FeedFilter) {
  return useInfiniteQuery({
    queryKey: feedKey(only),
    queryFn: ({ pageParam }) => getFeed(only, pageParam),
    initialPageParam: 1,
    // pagination meta is not confirmed yet: a short page means we reached the end
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length >= FEED_LIMIT ? pages.length + 1 : undefined,
  })
}
