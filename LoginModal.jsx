import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginModal({open, setOpen}){
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  if(!open) return null

  const submit = ()=>{
    // Mock login - in real app replace with API call
    setOpen(false)
    if(role === 'admin') navigate('/dashboard/admin')
    else navigate('/dashboard/student')
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-center">Welcome Back!</h3>
        
        {/* Role Selection */}
        <div className="mt-6">
          <p className="text-center text-gray-600 mb-4">Please select your role to continue</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setRole('student')}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                role === 'student' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-xl mb-2">👨‍🎓</div>
              <div className="font-medium">Student</div>
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                role === 'admin' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-xl mb-2">👨‍💼</div>
              <div className="font-medium">Admin</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="mt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder={role === 'student' ? "student@college.edu" : "admin@college.edu"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button 
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={submit}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Login as {role === 'admin' ? 'Admin' : 'Student'}
          </button>
        </div>
      </div>
    </div>
  )
}
