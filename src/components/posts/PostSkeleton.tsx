import { Card, Skeleton } from '@heroui/react'

export function PostSkeleton() {
  return (
    <Card className="gap-3 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-32 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
      </div>
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-56 w-full rounded-xl" />
    </Card>
  )
}
