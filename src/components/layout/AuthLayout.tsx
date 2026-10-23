import type { ReactNode } from 'react'
import { Card } from '@heroui/react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-accent">social</h1>
          <p className="mt-2 text-muted">تواصل مع أصحابك وشارك لحظاتك</p>
        </div>
        <Card className="p-2">
          <Card.Header>
            <Card.Title className="text-xl">{title}</Card.Title>
            <Card.Description>{subtitle}</Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-4">{children}</Card.Content>
          <Card.Footer className="justify-center text-sm text-muted">{footer}</Card.Footer>
        </Card>
      </div>
    </div>
  )
}
