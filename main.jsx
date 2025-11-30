import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { RegistrationsProvider } from './contexts/RegistrationsContext'
import App from './App'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import AdminDashboard from './pages/AdminDashboard'
import StudentDashboard from './pages/StudentDashboard'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RegistrationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="dashboard/admin" element={<AdminDashboard />} />
              <Route path="dashboard/student" element={<StudentDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </RegistrationsProvider>
    </AuthProvider>
  </React.StrictMode>
)
