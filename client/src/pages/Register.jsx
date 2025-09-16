import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../services/auth'
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const { first_name, last_name, email, password } = form
    if (!first_name || !last_name || !email || !password) {
      toast.error('All fields are required')
      return
    }
    try {
      setLoading(true)
      await AuthService.register(form)
      toast.success('Account created. Wait untill verification')
      setTimeout(() => navigate('/'), 800)
    } catch (err) {
        console.error('Registration error:', err)
      toast.error(err?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">🏭</div>
          <h1 className="mt-4 text-xl font-semibold text-gray-800">Create your account</h1>
          <p className="text-sm text-gray-500">Fill the form to register</p>
        </div>

        {error && <div className="mb-4 rounded-md bg-red-50 text-red-600 text-sm p-3 border border-red-200">{error}</div>}
        {success && <div className="mb-4 rounded-md bg-green-50 text-green-700 text-sm p-3 border border-green-200">{success}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input name="first_name" value={form.first_name} onChange={update} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input name="last_name" value={form.last_name} onChange={update} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={update} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={update} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <a href="#" className="text-blue-600 hover:underline" onClick={(e) => { e.preventDefault(); navigate('/') }}>Login</a>
        </p>
      </div>
    </div>
  )
}

export default Register