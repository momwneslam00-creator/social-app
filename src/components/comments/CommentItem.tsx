import { useState } from 'react'
import { Avatar, Button, Dropdown, TextArea, useOverlayState } from '@heroui/react'
import { MoreHorizontal, Pencil, ThumbsUp, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCommentMutations } from '../../hooks/useComments'
import { timeAgo } from '../../utils/formatDate'
import type { Comment } from '../../types'
import { ConfirmModal } from '../common/ConfirmModal'

interface CommentItemProps {
  comment: Comment
  postId: string
  postOwnerId: string
}

export function CommentItem({ comment, postId, postOwnerId }: CommentItemProps) {
  const { user } = useAuth()
  const { update, remove, like } = useCommentMutations(postId)
  const deleteModal = useOverlayState()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(comment.content ?? '')

  const author = comment.user ?? comment.commentCreator
  const isOwner = !!user && author?._id === user._id
  const canDelete = isOwner || user?._id === postOwnerId
  const liked = !!user && !!comment.likes?.includes(user._id)
  const likes = comment.likesCount ?? comment.likes?.length ?? 0

  const menu = (isOwner || canDelete) && (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="خيارات التعليق"
        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-secondary"
      >
        <MoreHorizontal size={18} />
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu
          onAction={(key) => {
            if (key === 'edit') {
              setDraft(comment.content ?? '')
              setEditing(true)
            }
            if (key === 'delete') deleteModal.open()
          }}
        >
          {isOwner ? (
            <Dropdown.Item id="edit" textValue="تعديل">
              <span className="flex items-center gap-2">
                <Pencil size={16} /> تعديل
              </span>
            </Dropdown.Item>
          ) : null}
          {canDelete ? (
            <Dropdown.Item id="delete" textValue="حذف" variant="danger">
              <span className="flex items-center gap-2">
                <Trash2 size={16} /> حذف
              </span>
            </Dropdown.Item>
          ) : null}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )

  return (
    <div className="flex items-start gap-3">
      <Avatar size="sm">
        <Avatar.Image src={author?.photo} alt={author?.name} />
        <Avatar.Fallback>{author?.name?.[0]}</Avatar.Fallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-surface-secondary px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{author?.name}</p>
            {menu}
          </div>

          {editing ? (
            <div className="mt-1 flex flex-col gap-2">
              <TextArea
                fullWidth
                rows={2}
                aria-label="تعديل التعليق"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="secondary" onPress={() => setEditing(false)}>
                  إلغاء
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  isPending={update.isPending}
                  isDisabled={!draft.trim()}
                  onPress={() =>
                    update.mutate(
                      { id: comment._id, content: draft.trim() },
                      { onSuccess: () => setEditing(false) },
                    )
                  }
                >
                  حفظ
                </Button>
              </div>
            </div>
          ) : (
            <>
              {comment.content && (
                <p className="whitespace-pre-wrap break-words text-sm">{comment.content}</p>
              )}
              {comment.image && (
                <img src={comment.image} alt="" loading="lazy" className="mt-2 max-h-60 rounded-lg" />
              )}
            </>
          )}
        </div>

        <div className="mt-1 flex items-center gap-3 px-2 text-xs text-muted">
          <span>{timeAgo(comment.createdAt)}</span>
          <button
            type="button"
            disabled={like.isPending}
            onClick={() => like.mutate(comment._id)}
            className={`flex items-center gap-1 font-semibold hover:underline ${liked ? 'text-accent' : ''}`}
          >
            <ThumbsUp size={13} fill={liked ? 'currentColor' : 'none'} />
            أعجبني{likes > 0 ? ` (${likes})` : ''}
          </button>
        </div>
      </div>

      {deleteModal.isOpen && (
        <ConfirmModal
          state={deleteModal}
          title="حذف التعليق"
          message="هل أنت متأكد من حذف هذا التعليق؟"
          isPending={remove.isPending}
          onConfirm={() => remove.mutate(comment._id, { onSuccess: deleteModal.close })}
        />
      )}
    </div>
  )
}
