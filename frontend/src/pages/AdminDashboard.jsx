import { useEffect, useState } from 'react'
import ClassroomManagement from '../components/ClassroomManagement'
import EnrollmentManagement from '../components/EnrollmentManagement'
import LogoutButton from '../components/LogoutButton'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [students, setStudents] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [editingUserId, setEditingUserId] = useState(null)
  const [editingStudentId, setEditingStudentId] = useState(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'PARENT',
    active: true,
  })

  const [editFormData, setEditFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'PARENT',
    active: true,
  })

  const [studentFormData, setStudentFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    registrationNumber: '',
    active: true,
  })

  const [editStudentFormData, setEditStudentFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    registrationNumber: '',
    active: true,
  })

  const token = localStorage.getItem('token')

  // =========================
  // USERS
  // =========================

  const fetchUsers = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/users',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load users')
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η φόρτωση των χρηστών.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      setMessage('Ο χρήστης δημιουργήθηκε επιτυχώς.')

      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'PARENT',
        active: true,
      })

      await fetchUsers()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η δημιουργία του χρήστη.')
    }
  }

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target

    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleEdit = (user) => {
    setMessage('')
    setError('')

    setEditingUserId(user.id)

    setEditFormData({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      active: user.active,
    })
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)

    setEditFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'PARENT',
      active: true,
    })
  }

  const handleUpdate = async (e, userId) => {
    e.preventDefault()

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFormData),
        }
      )

      if (response.status === 404) {
        setError('Ο χρήστης δεν βρέθηκε.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      setMessage('Ο χρήστης ενημερώθηκε επιτυχώς.')
      setEditingUserId(null)

      await fetchUsers()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η ενημέρωση του χρήστη.')
    }
  }

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      'Θέλεις σίγουρα να διαγράψεις αυτόν τον χρήστη;'
    )

    if (!confirmed) {
      return
    }

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 404) {
        setError('Ο χρήστης δεν βρέθηκε.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      setMessage('Ο χρήστης διαγράφηκε επιτυχώς.')

      await fetchUsers()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η διαγραφή του χρήστη.')
    }
  }

  // =========================
  // STUDENTS
  // =========================

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/students',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load students')
      }

      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η φόρτωση των μαθητών.')
    }
  }

  const handleStudentChange = (e) => {
    const { name, value, type, checked } = e.target

    setStudentFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleStudentSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/students',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(studentFormData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to create student')
      }

      setMessage('Ο μαθητής δημιουργήθηκε επιτυχώς.')

      setStudentFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        registrationNumber: '',
        active: true,
      })

      await fetchStudents()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η δημιουργία του μαθητή.')
    }
  }

  const handleStudentEditChange = (e) => {
    const { name, value, type, checked } = e.target

    setEditStudentFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleStudentEdit = (student) => {
    setMessage('')
    setError('')

    setEditingStudentId(student.id)

    setEditStudentFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      registrationNumber: student.registrationNumber,
      active: student.active,
    })
  }

  const handleCancelStudentEdit = () => {
    setEditingStudentId(null)

    setEditStudentFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      registrationNumber: '',
      active: true,
    })
  }

  const handleStudentUpdate = async (e, studentId) => {
    e.preventDefault()

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/students/${studentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editStudentFormData),
        }
      )

      if (response.status === 404) {
        setError('Ο μαθητής δεν βρέθηκε.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to update student')
      }

      setMessage('Ο μαθητής ενημερώθηκε επιτυχώς.')
      setEditingStudentId(null)

      await fetchStudents()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η ενημέρωση του μαθητή.')
    }
  }

  const handleStudentDelete = async (studentId) => {
    const confirmed = window.confirm(
      'Θέλεις σίγουρα να διαγράψεις αυτόν τον μαθητή;'
    )

    if (!confirmed) {
      return
    }

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/students/${studentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 404) {
        setError('Ο μαθητής δεν βρέθηκε.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to delete student')
      }

      setMessage('Ο μαθητής διαγράφηκε επιτυχώς.')

      await fetchStudents()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η διαγραφή του μαθητή.')
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchUsers()
    fetchStudents()
  }, [])

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <LogoutButton />

      <p>Καλώς ήρθατε στο περιβάλλον διαχείρισης.</p>

      {/* CREATE USER */}

      <section>
        <h2>Νέος Χρήστης</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName">Όνομα</label>

            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName">Επώνυμο</label>

            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Κωδικός</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="role">Ρόλος</label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="TEACHER">TEACHER</option>
              <option value="PARENT">PARENT</option>
            </select>
          </div>

          <div>
            <label>
              <input
                name="active"
                type="checkbox"
                checked={formData.active}
                onChange={handleChange}
              />

              Ενεργός χρήστης
            </label>
          </div>

          <button type="submit">
            Δημιουργία Χρήστη
          </button>
        </form>
      </section>

      <hr />

      {/* CREATE STUDENT */}

      <section>
        <h2>Νέος Μαθητής</h2>

        <form onSubmit={handleStudentSubmit}>
          <div>
            <label htmlFor="studentFirstName">Όνομα</label>

            <input
              id="studentFirstName"
              name="firstName"
              type="text"
              value={studentFormData.firstName}
              onChange={handleStudentChange}
              required
            />
          </div>

          <div>
            <label htmlFor="studentLastName">Επώνυμο</label>

            <input
              id="studentLastName"
              name="lastName"
              type="text"
              value={studentFormData.lastName}
              onChange={handleStudentChange}
              required
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth">
              Ημερομηνία γέννησης
            </label>

            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={studentFormData.dateOfBirth}
              onChange={handleStudentChange}
              required
            />
          </div>

          <div>
            <label htmlFor="registrationNumber">
              Αριθμός μητρώου
            </label>

            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              value={studentFormData.registrationNumber}
              onChange={handleStudentChange}
              required
            />
          </div>

          <div>
            <label>
              <input
                name="active"
                type="checkbox"
                checked={studentFormData.active}
                onChange={handleStudentChange}
              />

              Ενεργός μαθητής
            </label>
          </div>

          <button type="submit">
            Δημιουργία Μαθητή
          </button>
        </form>
      </section>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <hr />

      {/* USERS */}

      <section>
        <h2>Χρήστες</h2>

        {loading && <p>Φόρτωση...</p>}

        {!loading && users.length === 0 && (
          <p>Δεν υπάρχουν χρήστες.</p>
        )}

        {!loading &&
          users.map((user) => (
            <div key={user.id}>
              {editingUserId === user.id ? (
                <form
                  onSubmit={(e) => handleUpdate(e, user.id)}
                >
                  <h3>Επεξεργασία Χρήστη</h3>

                  <div>
                    <label>Όνομα</label>

                    <input
                      name="firstName"
                      type="text"
                      value={editFormData.firstName}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Επώνυμο</label>

                    <input
                      name="lastName"
                      type="text"
                      value={editFormData.lastName}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Email</label>

                    <input
                      name="email"
                      type="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div>
                    <label>
                      Νέος κωδικός (προαιρετικό)
                    </label>

                    <input
                      name="password"
                      type="password"
                      value={editFormData.password}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div>
                    <label>Ρόλος</label>

                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditChange}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="TEACHER">TEACHER</option>
                      <option value="PARENT">PARENT</option>
                    </select>
                  </div>

                  <div>
                    <label>
                      <input
                        name="active"
                        type="checkbox"
                        checked={editFormData.active}
                        onChange={handleEditChange}
                      />

                      Ενεργός χρήστης
                    </label>
                  </div>

                  <button type="submit">Αποθήκευση</button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    Ακύρωση
                  </button>
                </form>
              ) : (
                <>
                  <h3>
                    {user.firstName} {user.lastName}
                  </h3>

                  <p>Email: {user.email}</p>
                  <p>Ρόλος: {user.role}</p>

                  <p>
                    Ενεργός: {user.active ? 'Ναι' : 'Όχι'}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleEdit(user)}
                  >
                    Επεξεργασία
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(user.id)}
                  >
                    Διαγραφή
                  </button>
                </>
              )}

              <hr />
            </div>
          ))}
      </section>

      {/* STUDENTS */}

      <section>
        <h2>Μαθητές</h2>

        {students.length === 0 && (
          <p>Δεν υπάρχουν μαθητές.</p>
        )}

        {students.map((student) => (
          <div key={student.id}>
            {editingStudentId === student.id ? (
              <form
                onSubmit={(e) =>
                  handleStudentUpdate(e, student.id)
                }
              >
                <h3>Επεξεργασία Μαθητή</h3>

                <div>
                  <label>Όνομα</label>

                  <input
                    name="firstName"
                    type="text"
                    value={editStudentFormData.firstName}
                    onChange={handleStudentEditChange}
                    required
                  />
                </div>

                <div>
                  <label>Επώνυμο</label>

                  <input
                    name="lastName"
                    type="text"
                    value={editStudentFormData.lastName}
                    onChange={handleStudentEditChange}
                    required
                  />
                </div>

                <div>
                  <label>Ημερομηνία γέννησης</label>

                  <input
                    name="dateOfBirth"
                    type="date"
                    value={editStudentFormData.dateOfBirth}
                    onChange={handleStudentEditChange}
                    required
                  />
                </div>

                <div>
                  <label>Αριθμός μητρώου</label>

                  <input
                    name="registrationNumber"
                    type="text"
                    value={editStudentFormData.registrationNumber}
                    onChange={handleStudentEditChange}
                    required
                  />
                </div>

                <div>
                  <label>
                    <input
                      name="active"
                      type="checkbox"
                      checked={editStudentFormData.active}
                      onChange={handleStudentEditChange}
                    />

                    Ενεργός μαθητής
                  </label>
                </div>

                <button type="submit">
                  Αποθήκευση
                </button>

                <button
                  type="button"
                  onClick={handleCancelStudentEdit}
                >
                  Ακύρωση
                </button>
              </form>
            ) : (
              <>
                <h3>
                  {student.firstName} {student.lastName}
                </h3>

                <p>
                  Αριθμός μητρώου: {student.registrationNumber}
                </p>

                <p>
                  Ημερομηνία γέννησης: {student.dateOfBirth}
                </p>

                <p>
                  Ενεργός: {student.active ? 'Ναι' : 'Όχι'}
                </p>

                <button
                  type="button"
                  onClick={() => handleStudentEdit(student)}
                >
                  Επεξεργασία
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleStudentDelete(student.id)
                  }
                >
                  Διαγραφή
                </button>
              </>
            )}

            <hr />
          </div>
        ))}
      </section>

      <ClassroomManagement />
      <EnrollmentManagement />
    </div>
  )
}

export default AdminDashboard