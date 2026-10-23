import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Modal, toast, type useOverlayState } from '@heroui/react'
import { changePassword } from '../../api/users.api'
import { getErrorMessage } from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'
import { FormField } from '../common/FormField'

const schema = z
  .object({
    password: z.string().min(1, 'كلمة السر الحالية مطلوبة'),
    newPassword: z.string().min(8, 'كلمة السر الجديدة لا تقل عن 8 أحرف'),
    reNewPassword: z.string().min(1, 'تأكيد كلمة السر مطلوب'),
  })
  .refine((v) => v.newPassword === v.reNewPassword, {
    path: ['reNewPassword'],
    message: 'كلمتا السر غير متطابقتين',
  })
  .refine((v) => v.password !== v.newPassword, {
    path: ['newPassword'],
    message: 'كلمة السر الجديدة يجب أن تختلف عن الحالية',
  })

type Form = z.infer<typeof schema>

export function ChangePasswordModal({ state }: { state: ReturnType<typeof useOverlayState> }) {
  const { updateToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, reset } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', newPassword: '', reNewPassword: '' },
  })

  useEffect(() => {
    if (!state.isOpen) reset()
  }, [state.isOpen, reset])

  const onSubmit = async ({ password, newPassword }: Form) => {
    setLoading(true)
    try {
      const res = await changePassword({ password, newPassword })
      // the API rotates the token on success; keep the session alive with the new one
      if (res.data?.token) updateToken(res.data.token)
      toast.success('تم تغيير كلمة السر بنجاح')
      state.close()
    } catch (error) {
      toast.danger(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>تغيير كلمة السر</Modal.Heading>
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Modal.Body className="flex flex-col gap-4">
                <FormField
                  control={control}
                  name="password"
                  label="كلمة السر الحالية"
                  type="password"
                  autoComplete="current-password"
                />
                <FormField
                  control={control}
                  name="newPassword"
                  label="كلمة السر الجديدة"
                  type="password"
                  autoComplete="new-password"
                />
                <FormField
                  control={control}
                  name="reNewPassword"
                  label="تأكيد كلمة السر الجديدة"
                  type="password"
                  autoComplete="new-password"
                />
              </Modal.Body>
              <Modal.Footer>
                <Button type="button" variant="secondary" onPress={state.close}>
                  إلغاء
                </Button>
                <Button type="submit" variant="primary" isPending={loading}>
                  تغيير
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
