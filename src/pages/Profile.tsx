import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Skeleton, useOverlayState } from '@heroui/react'
import { getProfile } from '../api/users.api'
import { getErrorMessage } from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'
import { useFeed } from '../hooks/useFeed'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { ChangePasswordModal } from '../components/profile/ChangePasswordModal'
import { PostCard } from '../components/posts/PostCard'
import { PostSkeleton } from '../components/posts/PostSkeleton'

export default function Profile() {
  const { updateUser } = useAuth()
  const [params, setParams] = useSearchParams()
  const passwordModal = useOverlayState()

  const profile = useQuery({ queryKey: ['profile'], queryFn: getProfile })
  const posts = useFeed('me')

  const user = profile.data?.data.user

  // keep the stored user (navbar avatar, greeting) in sync with the server
  useEffect(() => {
    if (user) updateUser(user)
  }, [user, updateUser])

  // /profile?changePassword=1 (side menu link) opens the modal
  useEffect(() => {
    if (params.get('changePassword')) {
      passwordModal.open()
      params.delete('changePassword')
      setParams(params, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const myPosts = posts.data?.pages.flatMap((p) => p.data.posts) ?? []

  return (
    <div className="flex flex-col gap-4">
      {profile.isPending && <Skeleton className="h-72 w-full rounded-2xl" />}

      {profile.isError && (
        <Card className="items-center gap-3 p-6 text-center">
          <p>{getErrorMessage(profile.error)}</p>
          <Button variant="secondary" onPress={() => profile.refetch()}>
            إعادة المحاولة
          </Button>
        </Card>
      )}

      {user && <ProfileHeader user={user} onChangePassword={passwordModal.open} />}

      <h2 className="px-1 text-lg font-bold">بوستاتي</h2>

      {posts.isPending && <PostSkeleton />}
      {!posts.isPending && myPosts.length === 0 && (
        <Card className="p-8 text-center text-muted">لم تنشر أي بوست بعد</Card>
      )}
      {myPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {posts.hasNextPage && (
        <Button
          variant="secondary"
          isPending={posts.isFetchingNextPage}
          onPress={() => posts.fetchNextPage()}
        >
          عرض المزيد
        </Button>
      )}

      {passwordModal.isOpen && <ChangePasswordModal state={passwordModal} />}
    </div>
  )
}
