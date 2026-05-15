import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppShell } from './components/layout/AppShell'
import { Calculator } from './pages/Calculator'
import { History } from './pages/History'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{ style: { background: '#17171a', border: '1px solid #26262b', color: '#e7e7ea' } }}
      />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Calculator />} />
          <Route path="/history" element={<History />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
