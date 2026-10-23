import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, toast } from '@heroui/react'
import { signin } from '../api/users.api'
import { getErrorMessage } from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'
import { AuthLayout } from '../components/layout/AuthLayout'
import { FormField } from '../components/common/FormField'

const schema = z.object({
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('بريد إلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة السر مطلوبة'),
})

type LoginForm = z.infer<typeof schema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginForm) => {
    setLoading(true)
    try {
      const res = await signin(values)
      // TODO: confirm real response shape (data.token / data.user) on first run
      console.log('signin response', res)
      login(res.data.token, res.data.user ?? null)
      toast.success('تم تسجيل الدخول بنجاح')
      navigate('/', { replace: true })
    } catch (error) {
      toast.danger(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="تسجيل الدخول"
      subtitle="أدخل بياناتك للمتابعة"
      footer={
        <span>
          ليس لديك حساب؟{' '}
          <Link to="/signup" className="font-semibold text-accent hover:underline">
            إنشاء حساب
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormField
          control={control}
          name="email"
          label="البريد الإلكتروني"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
        />
        <FormField
          control={control}
          name="password"
          label="كلمة السر"
          type="password"
          autoComplete="current-password"
        />
        <Button type="submit" variant="primary" fullWidth isPending={loading}>
          تسجيل الدخول
        </Button>
      </form>
    </AuthLayout>
  )
}
