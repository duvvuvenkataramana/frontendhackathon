import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SignUpPage() {
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [showName, setShowName] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const submit = async () => {
    if (name && email && password) {
      try {
        const userData = {
          name,
          email,
          password,
          role,
          ...(role === 'student' && {
            rollNumber: rollNumber || 'ST' + Date.now().toString().slice(-6),
            department: department || 'Computer Science',
            year: year || '1st Year'
          })
        };

        const res = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });

        const data = await res.json();

        if (res.ok) {
          console.log('Signup successful:', data);
          login(data.user);
          setShowName(true);

          // Navigate after a short delay to show the success message
          setTimeout(() => {
            if (data.user.role === 'admin') {
              console.log('Navigating to admin dashboard');
              navigate('/dashboard/admin', { replace: true });
            } else {
              console.log('Navigating to student dashboard');
              navigate('/dashboard/student', { replace: true });
            }
          }, 1500);
        } else {
          alert(data.message || 'Signup failed');
        }
      } catch (err) {
        console.error('Signup error:', err);
        alert('An error occurred during signup');
      }
    } else {
      alert('Please fill in all required fields');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-center">Create Account</h3>

        {/* Role Selection */}
        <div className="mt-6">
          <p className="text-center text-gray-600 mb-4">Select your role to continue</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-4 rounded-lg border-2 text-center transition-all ${role === 'student'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="text-xl mb-2">👨‍🎓</div>
              <div className="font-medium">Student</div>
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-4 rounded-lg border-2 text-center transition-all ${role === 'admin'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="text-xl mb-2">👨‍💼</div>
              <div className="font-medium">Admin</div>
            </button>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className="mt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder={role === 'student' ? "student@college.edu" : "admin@college.edu"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password *</label>
              <input
                type="password"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                  <input
                    type="text"
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="e.g., ST2025001"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="e.g., Computer Science"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="text"
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="e.g., 3rd Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Show Name after Register */}
        {showName && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-md">
            <p className="text-green-800 font-medium">Welcome, {name}!</p>
            <p className="text-green-600 text-sm">Account created successfully. Redirecting...</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Already have an account?
          </button>
          <button
            type="button"
            onClick={submit}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Register as {role === 'admin' ? 'Admin' : 'Student'}
          </button>
        </div>
      </div>
    </div>
  )
}
