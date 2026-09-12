import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import './App.css'

import AdminDashboard from './pages/AdminDashboard.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import ParentDashboard from './pages/ParentDashboard.jsx'

function getCurrentUser() {
  const token = localStorage.getItem('token')

  if (!token) {
    return null
  }

  try {
    const decodedToken = jwtDecode(token)

    if (decodedToken.exp) {
      const currentTime = Date.now() / 1000

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token')
        return null
      }
    }

    return decodedToken
  } catch (error) {
    console.error('Invalid token:', error)

    localStorage.removeItem('token')

    return null
  }
}

function ProtectedRoute({ allowedRole, children }) {
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (user.role !== allowedRole) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />
    }

    if (user.role === 'TEACHER') {
      return <Navigate to="/teacher" replace />
    }

    if (user.role === 'PARENT') {
      return <Navigate to="/parent" replace />
    }

    localStorage.removeItem('token')

    return <Navigate to="/" replace />
  }

  return children
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      if (!response.ok) {
        setMessage('Λάθος email ή κωδικός πρόσβασης.')
        return
      }

      const data = await response.json()

      localStorage.setItem('token', data.token)

      const decodedToken = jwtDecode(data.token)

      if (decodedToken.role === 'ADMIN') {
        navigate('/admin')
      } else if (decodedToken.role === 'TEACHER') {
        navigate('/teacher')
      } else if (decodedToken.role === 'PARENT') {
        navigate('/parent')
      } else {
        localStorage.removeItem('token')
        setMessage('Άγνωστος ρόλος χρήστη.')
      }
    } catch (error) {
      console.error(error)

      setMessage(
        'Δεν ήταν δυνατή η σύνδεση με τον server. Έλεγξε ότι το Spring Boot τρέχει.'
      )
    } finally {
      setLoading(false)
    }
  }

  const existingUser = getCurrentUser()

  if (existingUser) {
    if (existingUser.role === 'ADMIN') {
      return <Navigate to="/admin" replace />
    }

    if (existingUser.role === 'TEACHER') {
      return <Navigate to="/teacher" replace />
    }

    if (existingUser.role === 'PARENT') {
      return <Navigate to="/parent" replace />
    }
  }

  return (
    <div>
      <h1>BIG BANG School Management</h1>

      <p>
        School Communication and Attendance Management System
      </p>

      <h2>Σύνδεση</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Κωδικός πρόσβασης
          </label>

          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Σύνδεση...'
            : 'Σύνδεση'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="TEACHER">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRole="PARENT">
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App