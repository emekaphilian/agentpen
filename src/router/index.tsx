import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from '../features/overview/HomePage'
import SystemsPage from '../features/registry/SystemsPage'
import SystemDetailsPage from '../features/registry/SystemDetailsPage'
import DashboardLayout from '../layouts/DashboardLayout'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout><HomePage /></DashboardLayout>} />
      <Route path="/systems" element={<DashboardLayout><SystemsPage /></DashboardLayout>} />
      <Route path="/systems/:systemId" element={<DashboardLayout><SystemDetailsPage /></DashboardLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
