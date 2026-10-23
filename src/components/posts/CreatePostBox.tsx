import { Avatar, Card, useOverlayState } from '@heroui/react'
import { useAuth } from '../../context/AuthContext'
import { usePostMutations } from '../../hooks/usePostMutations'
import { PostFormModal } from './PostFormModal'

export function CreatePostBox() {
  const { user } = useAuth()
  const modal = useOverlayState()
  const { create } = usePostMutations()

  return (
    <>
      <Card className="p-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <Avatar.Image src={user?.photo} alt={user?.name} />
            <Avatar.Fallback>{user?.name?.[0]}</Avatar.Fallback>
          </Avatar>
          <button
            type="button"
            onClick={modal.open}
            className="flex-1 rounded-full bg-surface-secondary px-4 py-2.5 text-start text-muted transition-colors hover:bg-surface-tertiary"
          >
            بم تفكر يا {user?.name}؟
          </button>
        </div>
      </Card>
      {modal.isOpen && (
        <PostFormModal
          state={modal}
          isPending={create.isPending}
          onSubmit={(payload) => create.mutate(payload, { onSuccess: modal.close })}
        />
      )}
    </>
  )
}
