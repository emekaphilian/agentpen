import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SystemsPage from './pages/SystemsPage'
import SystemDetailsPage from './pages/SystemDetailsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/systems" element={<SystemsPage />} />
      <Route path="/systems/:systemId" element={<SystemDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
