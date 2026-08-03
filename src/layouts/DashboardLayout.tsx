import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MainContent from './MainContent'
import CopilotPanel from '../features/copilot/CopilotPanel'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [copilotOpen, setCopilotOpen] = useState(true)

  return (
    <div className="app-shell-root">
      <Sidebar />
      <div className="main">
        <Topbar />
        <MainContent>{children}</MainContent>
      </div>
      <CopilotPanel open={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  )
}
