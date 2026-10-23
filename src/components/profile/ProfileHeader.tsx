import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar, Button, Card, toast } from '@heroui/react'
import { Camera, KeyRound } from 'lucide-react'
import { uploadPhoto } from '../../api/users.api'
import { getErrorMessage } from '../../api/axiosInstance'
import type { User } from '../../types'

interface ProfileHeaderProps {
  user: User
  onChangePassword: () => void
}

function Stat({ value, label }: { value?: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold">{value ?? 0}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}

export function ProfileHeader({ user, onChangePassword }: ProfileHeaderProps) {
  const qc = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: async () => {
      toast.success('تم تحديث الصورة')
      await qc.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (e) => toast.danger(getErrorMessage(e)),
  })

  return (
    <Card className="overflow-hidden p-0">
      <div
        className="h-40 bg-gradient-to-l from-accent/60 to-accent-soft bg-cover bg-center"
        style={user.cover ? { backgroundImage: `url(${user.cover})` } : undefined}
      />
      <div className="flex flex-col gap-4 p-4">
        <div className="-mt-16 flex items-end justify-between gap-3">
          <div className="relative">
            <Avatar size="lg" className="h-28 w-28 border-4 border-surface">
              <Avatar.Image src={user.photo} alt={user.name} />
              <Avatar.Fallback>{user.name?.[0]}</Avatar.Fallback>
            </Avatar>
            <Button
              isIconOnly
              size="sm"
              variant="secondary"
              className="absolute -bottom-1 -end-1"
              aria-label="تغيير الصورة"
              isPending={upload.isPending}
              onPress={() => inputRef.current?.click()}
            >
              <Camera size={16} />
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) upload.mutate(file)
                e.target.value = ''
              }}
            />
          </div>
          <Button variant="secondary" onPress={onChangePassword}>
            <KeyRound size={18} />
            تغيير كلمة السر
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted">@{user.username}</p>
          <p className="text-sm text-muted">{user.email}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
          <Stat value={user.followersCount} label="متابِع" />
          <Stat value={user.followingCount} label="يتابع" />
          <Stat value={user.bookmarksCount} label="محفوظات" />
        </div>
      </div>
    </Card>
  )
}
