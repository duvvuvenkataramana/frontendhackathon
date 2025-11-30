import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaSvg, setCaptchaSvg] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  // Fetch Captcha
  const fetchCaptcha = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/captcha', {
        credentials: 'include' // Important for session cookie
      });
      const data = await res.text();
      setCaptchaSvg(data);
    } catch (err) {
      console.error('Failed to fetch captcha', err);
    }
  };

  React.useEffect(() => {
    fetchCaptcha();
  }, []);

  const submit = async () => {
    if (email && password && captchaInput) {
      try {
        const res = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, captcha: captchaInput, role }),
          credentials: 'include'
        });

        const data = await res.json();

        if (res.ok) {
          console.log('Login successful:', data);
          login(data.user);
          if (data.user.role === 'admin') {
            navigate('/dashboard/admin', { replace: true });
          } else {
            navigate('/dashboard/student', { replace: true });
          }
        } else {
          alert(data.message || 'Login failed');
          fetchCaptcha(); // Refresh captcha on failure
          setCaptchaInput('');
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('An error occurred during login');
      }
    } else {
      alert('Please enter email, password, and captcha');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-center">Welcome Back!</h3>

        {/* Role Selection */}
        <div className="mt-6">
          <p className="text-center text-gray-600 mb-4">Please select your role to continue</p>
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

            {/* Captcha Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Security Check</label>
              <div className="flex gap-2 mb-2">
                <div
                  className="border rounded p-2 bg-gray-100 flex-grow flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: captchaSvg }}
                />
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  className="p-2 border rounded hover:bg-gray-50"
                  title="Refresh Captcha"
                >
                  🔄
                </button>
              </div>
              <input
                type="text"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Enter the characters above"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Back
          </button>
          <button
            type="button"
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
