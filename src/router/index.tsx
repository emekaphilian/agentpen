import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from '../features/overview/HomePage'
import SystemsListPage from '../features/registry/SystemsListPage'
import SystemDetailsPage from '../features/registry/SystemDetailsPage'
import DashboardLayout from '../layouts/DashboardLayout'
import OperationalDashboard from '../components/operational/OperationalDashboard'
import EvaluationPage from '../features/evaluation/EvaluationPage'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout><OperationalDashboard /></DashboardLayout>} />
      <Route path="/systems" element={<DashboardLayout><SystemsListPage /></DashboardLayout>} />
      <Route path="/systems/:systemId" element={<DashboardLayout><SystemDetailsPage /></DashboardLayout>} />
      <Route path="/evaluations" element={<DashboardLayout><EvaluationPage /></DashboardLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
