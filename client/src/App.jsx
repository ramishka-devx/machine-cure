import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import DashboardLayout from './layouts/DashboardLayout'
import Machines from './pages/machines/Machines'
import { Users } from './pages/users/Users'
import Divisions from './pages/divisions/Divisions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Kaizens from './pages/kaizens/Kaizens'
import { Breakdowns } from './pages/breakdowns/Breakdowns'

function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="machines" element={<Machines />} />
          {/* Placeholder routes for future pages */}
          <Route path="records" element={<div className='p-6'>Records</div>} />
          <Route path="divisions" element={<Divisions/>} />
          <Route path="maintenance" element={<div className='p-6'>Maintenance</div>} />
          <Route path="breakdown" element={<Breakdowns/>} />
          <Route path="kaizen" element={<Kaizens/>} />
          <Route path="kaizens" element={<Kaizens/>} />
          <Route path="users" element={<Users/>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
     </BrowserRouter>
     <ToastContainer/>
    </>
  )
}

export default App
