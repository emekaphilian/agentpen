import { Route, Routes, Navigate } from 'react-router-dom'
import LandingPage from '../features/overview/LandingPage'
import ExecutiveDashboardPlaceholder from '../features/overview/ExecutiveDashboardPlaceholder'
import HomePage from '../features/overview/HomePage'
import SystemsListPage from '../features/registry/SystemsListPage'
import SystemDetailsPage from '../features/registry/SystemDetailsPage'
import DashboardLayout from '../layouts/DashboardLayout'
import OperationalDashboard from '../components/operational/OperationalDashboard'
import EvaluationPage from '../features/evaluation/EvaluationPage'
import DiscoveryPage from '../features/discovery/DiscoveryPage'
import EvidencePage from '../features/evidence/EvidencePage'
import AssurancePage from '../features/assurance/AssurancePage'
import { AssuranceReportPage } from '../features/reports/AssuranceReportPage'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/operations" element={<DashboardLayout><OperationalDashboard /></DashboardLayout>} />
      <Route path="/executive" element={<DashboardLayout><ExecutiveDashboardPlaceholder /></DashboardLayout>} />
      <Route path="/systems" element={<DashboardLayout><SystemsListPage /></DashboardLayout>} />
      <Route path="/systems/:systemId" element={<DashboardLayout><SystemDetailsPage /></DashboardLayout>} />
      <Route path="/discovery" element={<DashboardLayout><DiscoveryPage /></DashboardLayout>} />
      <Route path="/evaluations" element={<DashboardLayout><EvaluationPage /></DashboardLayout>} />
      <Route path="/evidence" element={<DashboardLayout><EvidencePage /></DashboardLayout>} />
      <Route path="/assurance" element={<DashboardLayout><AssurancePage /></DashboardLayout>} />
      <Route path="/reports" element={<DashboardLayout><AssuranceReportPage /></DashboardLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
