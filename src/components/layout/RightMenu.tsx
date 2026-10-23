import { NavLink } from 'react-router-dom'
import { Avatar } from '@heroui/react'
import { Home, KeyRound, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors ${
    isActive ? 'bg-accent-soft text-accent' : 'hover:bg-surface-secondary'
  }`

export function RightMenu() {
  const { user } = useAuth()

  return (
    <aside className="sticky top-16 hidden h-fit w-72 shrink-0 flex-col gap-1 lg:flex">
      <NavLink to="/profile" className={linkClass}>
        <Avatar size="sm">
          <Avatar.Image src={user?.photo} alt={user?.name} />
          <Avatar.Fallback>{user?.name?.[0]}</Avatar.Fallback>
        </Avatar>
        <span className="truncate">{user?.name}</span>
      </NavLink>
      <NavLink to="/" end className={linkClass}>
        <Home size={22} />
        الصفحة الرئيسية
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        <User size={22} />
        البروفايل
      </NavLink>
      <NavLink to="/profile?changePassword=1" className={linkClass}>
        <KeyRound size={22} />
        تغيير كلمة السر
      </NavLink>
    </aside>
  )
}
