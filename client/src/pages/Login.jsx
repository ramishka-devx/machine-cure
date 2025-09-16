import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../services/auth'
import { toast } from 'react-toastify';
import logo from '../assets/logo.png'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      toast.error('Email and password are required')
      return
    }
    try {
      setLoading(true)
      await AuthService.login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.message || 'Login failed')
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
            <img src={logo} alt="" />
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-gray-800">Machine Cure</h1>
          <p className="text-sm text-gray-500">Welcome back! Please login to your account</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 text-red-600 text-sm p-3 border border-red-200">{error}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email or user name"
                className="w-full pl-2 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full pl-2 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoComplete="current-password"
              />
            </div>
            <div className="text-right mt-1 hidden">
              <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => alert('Implement forgot password later')}>Forget password?</button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have Account? <a href="#" className="text-blue-600 hover:underline" onClick={(e) => { e.preventDefault(); navigate('/register') }}>Register</a>
        </p>
      </div>
    </div>
  )
}

export default Login