import { useEffect, useRef, useState } from 'react'
import { Avatar, Button, TextArea } from '@heroui/react'
import { ImagePlus, Send, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { CommentFormPayload } from '../../types'

interface CommentFormProps {
  isPending?: boolean
  onSubmit: (payload: CommentFormPayload, reset: () => void) => void
}

export function CommentForm({ isPending, onSubmit }: CommentFormProps) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const reset = () => {
    setContent('')
    setFile(null)
  }
  const canSubmit = content.trim().length > 0 || !!file

  return (
    <div className="flex items-start gap-3">
      <Avatar size="sm">
        <Avatar.Image src={user?.photo} alt={user?.name} />
        <Avatar.Fallback>{user?.name?.[0]}</Avatar.Fallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <TextArea
          fullWidth
          rows={2}
          placeholder="اكتب تعليقًا..."
          aria-label="تعليق"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {preview && (
          <div className="relative w-fit">
            <img src={preview} alt="" className="max-h-40 rounded-lg" />
            <Button
              isIconOnly
              size="sm"
              variant="secondary"
              className="absolute start-1 top-1"
              aria-label="إزالة الصورة"
              onPress={() => setFile(null)}
            >
              <X size={14} />
            </Button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Button isIconOnly size="sm" variant="ghost" aria-label="إضافة صورة" onPress={() => inputRef.current?.click()}>
            <ImagePlus size={18} />
          </Button>
          <Button
            size="sm"
            variant="primary"
            isPending={isPending}
            isDisabled={!canSubmit}
            onPress={() => onSubmit({ content: content.trim(), image: file }, reset)}
          >
            <Send size={16} />
            إرسال
          </Button>
        </div>
      </div>
    </div>
  )
}
