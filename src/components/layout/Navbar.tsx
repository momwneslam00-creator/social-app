import { Link, NavLink } from 'react-router-dom'
import { Avatar, Button } from '@heroui/react'
import { Home, LogOut, Moon, Sun, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `flex h-14 w-20 items-center justify-center border-b-4 transition-colors sm:w-28 ${
    isActive ? 'border-accent text-accent' : 'border-transparent text-muted hover:bg-surface-secondary'
  }`

export function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3">
        <Link to="/" className="text-2xl font-bold text-accent">
          social
        </Link>

        <nav className="flex items-center">
          <NavLink to="/" end className={tabClass} aria-label="الرئيسية">
            <Home size={24} />
          </NavLink>
          <NavLink to="/profile" className={tabClass} aria-label="البروفايل">
            <User size={24} />
          </NavLink>
        </nav>

        <div className="flex items-center gap-1">
          <Button isIconOnly variant="ghost" onPress={toggleTheme} aria-label="تغيير الثيم">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Link to="/profile" aria-label="حسابي">
            <Avatar size="sm">
              <Avatar.Image src={user?.photo} alt={user?.name} />
              <Avatar.Fallback>{user?.name?.[0]}</Avatar.Fallback>
            </Avatar>
          </Link>
          <Button isIconOnly variant="ghost" onPress={logout} aria-label="تسجيل الخروج">
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </header>
  )
}
