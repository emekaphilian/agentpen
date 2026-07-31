import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from '../features/overview/HomePage'
import SystemsPage from '../features/registry/SystemsPage'
import SystemDetailsPage from '../features/registry/SystemDetailsPage'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/systems" element={<SystemsPage />} />
      <Route path="/systems/:systemId" element={<SystemDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
