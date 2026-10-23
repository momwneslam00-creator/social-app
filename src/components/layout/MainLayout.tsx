import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { RightMenu } from './RightMenu'

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-3 py-4">
        <RightMenu />
        <main className="mx-auto w-full max-w-2xl min-w-0 flex-1">
          <Outlet />
        </main>
        {/* left column (suggestions) comes later; keeps the feed centered on large screens */}
        <div className="hidden w-72 shrink-0 xl:block" />
      </div>
    </div>
  )
}
