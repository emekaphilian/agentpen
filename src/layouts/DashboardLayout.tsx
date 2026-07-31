import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MainContent from './MainContent'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="app-shell-root">
      <Sidebar />
      <div className="main">
        <Topbar />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  )
}
