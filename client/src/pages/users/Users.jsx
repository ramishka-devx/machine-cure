import React, { useEffect, useMemo, useState } from 'react'
import { UsersService } from '../../services/users'

export const Users = () => {
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [analytics, setAnalytics] = useState({ total: 0, verified: 0, pending: 0, deleted: 0 })

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

  useEffect(() => {
    let ignore = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await UsersService.list({ page, limit })
        if (!ignore) {
          setRows(data.rows ?? data?.data?.rows ?? [])
          setTotal(data.total ?? data?.data?.total ?? 0)
        }
      } catch (e) {
        if (!ignore) setError(e?.message || 'Failed to load users')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [page, limit])

  useEffect(() => {
    let ignore = false
    const loadAnalytics = async () => {
      setAnalyticsLoading(true)
      try {
        const data = await UsersService.analytics()
        if (!ignore) {
          setAnalytics({
            total: Number(data.total ?? 0),
            verified: Number(data.verified ?? 0),
            pending: Number(data.pending ?? 0),
            deleted: Number(data.deleted ?? 0),
          })
        }
      } catch (e) {
        // ignore analytics errors
      } finally {
        if (!ignore) setAnalyticsLoading(false)
      }
    }
    loadAnalytics()
    return () => { ignore = true }
  }, [])

  const onChangeStatus = async (user, status) => {
    const prev = [...rows]
    setRows((r) => r.map((x) => x.user_id === user.user_id ? { ...x, status } : x))
    try {
      await UsersService.updateStatus(user.user_id, status)
      // refresh analytics after status change
      const data = await UsersService.analytics()
      setAnalytics({
        total: Number(data.total ?? 0),
        verified: Number(data.verified ?? 0),
        pending: Number(data.pending ?? 0),
        deleted: Number(data.deleted ?? 0),
      })
    } catch (e) {
      // rollback on error
      setRows(prev)
      alert(e?.message || 'Failed to update status')
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>

      {/* Analytics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total Users',
            key: 'total',
            color: 'bg-blue-50 text-blue-700'
          },
          {
            label: 'Verified Users',
            key: 'verified',
            color: 'bg-green-50 text-green-700'
          },
          {
            label: 'Pending Verifications',
            key: 'pending',
            color: 'bg-amber-50 text-amber-700'
          },
          {
            label: 'Deactivated Accounts',
            key: 'deleted',
            color: 'bg-rose-50 text-rose-700'
          }
        ].map((c) => (
          <div key={c.key} className={`rounded-xl border border-gray-200 p-4 ${c.color}`}>
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className="mt-2 text-2xl font-semibold">
              {analyticsLoading ? '—' : analytics[c.key]}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-medium">All Users</div>
          <div className="text-sm text-gray-500">Showing page {page} of {totalPages}</div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Name</th>
                <th className="px-4 py-2 text-left font-medium">Email</th>
                <th className="px-4 py-2 text-left font-medium">Role</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-500">Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-500">No users</td></tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.user_id} className="border-t border-gray-100">
                    <td className="px-4 py-2">{u.first_name} {u.last_name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2 capitalize">{u.role || u.role_id}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.status === 'verified' ? 'bg-green-100 text-green-700' :
                        u.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        value={u.status}
                        onChange={(e) => onChangeStatus(u, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="deleted">Deactivated</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="text-gray-500">Total: {total}</div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Prev
            </button>
            <div>Page {page} / {totalPages}</div>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Next
            </button>
            <select
              value={limit}
              onChange={(e) => { setPage(1); setLimit(Number(e.target.value)) }}
              className="ml-2 border rounded px-2 py-1"
            >
              {[10, 20, 50].map(n => (
                <option key={n} value={n}>{n}/page</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (<div className="mt-4 text-rose-600 text-sm">{error}</div>)}
    </div>
  )
}
