import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Card, Dropdown, useOverlayState } from '@heroui/react'
import { MessageCircle, MoreHorizontal, Pencil, ThumbsUp, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { usePostMutations } from '../../hooks/usePostMutations'
import { timeAgo } from '../../utils/formatDate'
import type { Post } from '../../types'
import { ConfirmModal } from '../common/ConfirmModal'
import { PostFormModal } from './PostFormModal'

function PostHeader({ post, menu }: { post: Post; menu?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <Avatar.Image src={post.user.photo} alt={post.user.name} />
        <Avatar.Fallback>{post.user.name?.[0]}</Avatar.Fallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{post.user.name}</p>
        <p className="text-xs text-muted">
          @{post.user.username} · {timeAgo(post.createdAt)}
        </p>
      </div>
      {menu}
    </div>
  )
}

function PostContent({ post }: { post: Post }) {
  return (
    <>
      {post.body && <p className="whitespace-pre-wrap break-words">{post.body}</p>}
      {post.image && (
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="max-h-[32rem] w-full rounded-xl object-cover"
        />
      )}
    </>
  )
}

export function PostCard({ post, detailed = false }: { post: Post; detailed?: boolean }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { update, remove, like } = usePostMutations()
  const editModal = useOverlayState()
  const deleteModal = useOverlayState()

  const isOwner = user?._id === post.user._id
  const liked = !!user && post.likes.includes(user._id)

  const menu = isOwner && (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="خيارات البوست"
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-secondary"
      >
        <MoreHorizontal size={20} />
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu
          onAction={(key) => {
            if (key === 'edit') editModal.open()
            if (key === 'delete') deleteModal.open()
          }}
        >
          <Dropdown.Item id="edit" textValue="تعديل">
            <span className="flex items-center gap-2">
              <Pencil size={16} /> تعديل
            </span>
          </Dropdown.Item>
          <Dropdown.Item id="delete" textValue="حذف" variant="danger">
            <span className="flex items-center gap-2">
              <Trash2 size={16} /> حذف
            </span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )

  return (
    <Card className="gap-3 p-4">
      <PostHeader post={post} menu={menu} />

      {post.isShare && post.sharedPost ? (
        <>
          {post.body && <p className="whitespace-pre-wrap break-words">{post.body}</p>}
          <div className="flex flex-col gap-3 rounded-xl border border-border p-3">
            <PostHeader post={post.sharedPost} />
            <PostContent post={post.sharedPost} />
          </div>
        </>
      ) : (
        <PostContent post={post} />
      )}

      <div className="flex items-center justify-between text-sm text-muted">
        <span>{post.likesCount} إعجاب</span>
        <button type="button" onClick={() => navigate(`/posts/${post._id}`)} className="hover:underline">
          {post.commentsCount} تعليق · {post.sharesCount} مشاركة
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1 border-t border-border pt-2">
        <Button
          variant="ghost"
          className={liked ? 'text-accent' : ''}
          isDisabled={like.isPending}
          onPress={() => like.mutate(post._id)}
        >
          <ThumbsUp size={18} fill={liked ? 'currentColor' : 'none'} />
          أعجبني
        </Button>
        <Button
          variant="ghost"
          isDisabled={detailed}
          onPress={() => navigate(`/posts/${post._id}`)}
        >
          <MessageCircle size={18} />
          تعليق
        </Button>
      </div>

      {isOwner && (
        <>
          {editModal.isOpen && (
            <PostFormModal
              state={editModal}
              post={post}
              isPending={update.isPending}
              onSubmit={(payload) =>
                update.mutate({ id: post._id, ...payload }, { onSuccess: editModal.close })
              }
            />
          )}
          {deleteModal.isOpen && (
            <ConfirmModal
              state={deleteModal}
              title="حذف البوست"
              message="هل أنت متأكد من حذف هذا البوست؟ لا يمكن التراجع عن ذلك."
              isPending={remove.isPending}
              onConfirm={() =>
                remove.mutate(post._id, {
                  onSuccess: () => {
                    deleteModal.close()
                    if (detailed) navigate('/', { replace: true })
                  },
                })
              }
            />
          )}
        </>
      )}
    </Card>
  )
}
