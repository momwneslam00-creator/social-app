import { Button, Modal, type useOverlayState } from '@heroui/react'

interface ConfirmModalProps {
  state: ReturnType<typeof useOverlayState>
  title: string
  message: string
  confirmLabel?: string
  isPending?: boolean
  onConfirm: () => void
}

export function ConfirmModal({
  state,
  title,
  message,
  confirmLabel = 'حذف',
  isPending,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-sm">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{title}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-muted">{message}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={state.close}>
                إلغاء
              </Button>
              <Button variant="danger" isPending={isPending} onPress={onConfirm}>
                {confirmLabel}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
