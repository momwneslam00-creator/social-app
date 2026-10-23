import { useEffect, useRef, useState } from 'react'
import { Button, Modal, TextArea, type useOverlayState } from '@heroui/react'
import { ImagePlus, X } from 'lucide-react'
import type { Post, PostFormPayload } from '../../types'

interface PostFormModalProps {
  state: ReturnType<typeof useOverlayState>
  /** when provided the modal edits this post, otherwise it creates a new one */
  post?: Post
  isPending?: boolean
  onSubmit: (payload: PostFormPayload) => void
}

export function PostFormModal({ state, post, isPending, onSubmit }: PostFormModalProps) {
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isEdit = !!post

  // reset the form every time the modal opens
  useEffect(() => {
    if (state.isOpen) {
      setBody(post?.body ?? '')
      setFile(null)
      setPreview(post?.image ?? null)
    }
  }, [state.isOpen, post])

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const canSubmit = body.trim().length > 0 || !!file || !!preview

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{isEdit ? 'تعديل البوست' : 'إنشاء بوست'}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-3">
              <TextArea
                fullWidth
                rows={4}
                placeholder="بم تفكر؟"
                aria-label="نص البوست"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              {preview && (
                <div className="relative overflow-hidden rounded-xl">
                  <img src={preview} alt="" className="max-h-72 w-full object-cover" />
                  <Button
                    isIconOnly
                    size="sm"
                    variant="secondary"
                    className="absolute start-2 top-2"
                    aria-label="إزالة الصورة"
                    onPress={() => {
                      setFile(null)
                      setPreview(null)
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <Button variant="secondary" onPress={() => inputRef.current?.click()}>
                <ImagePlus size={18} />
                {preview ? 'تغيير الصورة' : 'إضافة صورة'}
              </Button>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={state.close}>
                إلغاء
              </Button>
              <Button
                variant="primary"
                isPending={isPending}
                isDisabled={!canSubmit}
                onPress={() => onSubmit({ body: body.trim(), image: file })}
              >
                {isEdit ? 'حفظ' : 'نشر'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
