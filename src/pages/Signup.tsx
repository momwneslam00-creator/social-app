import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, toast } from '@heroui/react'
import { signup } from '../api/users.api'
import { getErrorMessage } from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'
import { AuthLayout } from '../components/layout/AuthLayout'
import { FormField } from '../components/common/FormField'

const schema = z
  .object({
    name: z.string().min(3, 'الاسم لا يقل عن 3 أحرف'),
    username: z
      .string()
      .min(3, 'اسم المستخدم لا يقل عن 3 أحرف')
      .regex(/^[a-zA-Z0-9_.]+$/, 'حروف إنجليزية وأرقام و _ . فقط'),
    email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('بريد إلكتروني غير صالح'),
    dateOfBirth: z.string().min(1, 'تاريخ الميلاد مطلوب'),
    gender: z.enum(['male', 'female']),
    password: z.string().min(8, 'كلمة السر لا تقل عن 8 أحرف'),
    rePassword: z.string().min(1, 'تأكيد كلمة السر مطلوب'),
  })
  .refine((v) => v.password === v.rePassword, {
    path: ['rePassword'],
    message: 'كلمتا السر غير متطابقتين',
  })

type SignupForm = z.infer<typeof schema>

export default function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit } = useForm<SignupForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      dateOfBirth: '',
      gender: 'male',
      password: '',
      rePassword: '',
    },
  })

  const onSubmit = async (values: SignupForm) => {
    setLoading(true)
    try {
      const res = await signup(values)
      // TODO: confirm real response shape on first run
      console.log('signup response', res)
      if (res.data?.token) {
        login(res.data.token, res.data.user ?? null)
        navigate('/', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
      toast.success('تم إنشاء الحساب بنجاح')
    } catch (error) {
      toast.danger(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="إنشاء حساب جديد"
      subtitle="سجل بياناتك وابدأ الآن"
      footer={
        <span>
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            تسجيل الدخول
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormField control={control} name="name" label="الاسم" autoComplete="name" />
        <FormField
          control={control}
          name="username"
          label="اسم المستخدم"
          placeholder="username"
          autoComplete="username"
        />
        <FormField
          control={control}
          name="email"
          label="البريد الإلكتروني"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
        />
        <FormField control={control} name="dateOfBirth" label="تاريخ الميلاد" type="date" />

        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">النوع</span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={field.value === 'male' ? 'primary' : 'secondary'}
                  onPress={() => field.onChange('male')}
                >
                  ذكر
                </Button>
                <Button
                  type="button"
                  variant={field.value === 'female' ? 'primary' : 'secondary'}
                  onPress={() => field.onChange('female')}
                >
                  أنثى
                </Button>
              </div>
            </div>
          )}
        />

        <FormField
          control={control}
          name="password"
          label="كلمة السر"
          type="password"
          autoComplete="new-password"
        />
        <FormField
          control={control}
          name="rePassword"
          label="تأكيد كلمة السر"
          type="password"
          autoComplete="new-password"
        />
        <Button type="submit" variant="primary" fullWidth isPending={loading}>
          إنشاء الحساب
        </Button>
      </form>
    </AuthLayout>
  )
}
