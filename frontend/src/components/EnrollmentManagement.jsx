import { useEffect, useState } from 'react'

function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState([])
  const [students, setStudents] = useState([])
  const [classrooms, setClassrooms] = useState([])

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [editingEnrollmentId, setEditingEnrollmentId] = useState(null)

  const [formData, setFormData] = useState({
    studentId: '',
    classroomId: '',
    enrollmentDate: '',
    active: true,
  })

  const [editFormData, setEditFormData] = useState({
    studentId: '',
    classroomId: '',
    enrollmentDate: '',
    active: true,
  })

  const token = localStorage.getItem('token')

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/enrollments',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load enrollments')
      }

      const data = await response.json()
      setEnrollments(data)
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η φόρτωση των εγγραφών.')
    }
  }

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
    }
  }

  const fetchClassrooms = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/classrooms',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load classrooms')
      }

      const data = await response.json()
      setClassrooms(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchEnrollments()
    fetchStudents()
    fetchClassrooms()
  }, [])

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

    const payload = {
      student: {
        id: Number(formData.studentId),
      },
      classroom: {
        id: Number(formData.classroomId),
      },
      enrollmentDate: formData.enrollmentDate,
      active: formData.active,
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/enrollments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const errorMessage = await response.text()

        setError(
          errorMessage ||
            'Δεν ήταν δυνατή η δημιουργία της εγγραφής.'
        )

        return
      }

      setMessage('Η εγγραφή μαθητή δημιουργήθηκε επιτυχώς.')

      setFormData({
        studentId: '',
        classroomId: '',
        enrollmentDate: '',
        active: true,
      })

      await fetchEnrollments()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η δημιουργία της εγγραφής.')
    }
  }

  const handleEdit = (enrollment) => {
    setMessage('')
    setError('')

    setEditingEnrollmentId(enrollment.id)

    setEditFormData({
      studentId: enrollment.student.id,
      classroomId: enrollment.classroom.id,
      enrollmentDate: enrollment.enrollmentDate,
      active: enrollment.active,
    })
  }

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target

    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCancelEdit = () => {
    setEditingEnrollmentId(null)
  }

  const handleUpdate = async (e, enrollmentId) => {
    e.preventDefault()

    setMessage('')
    setError('')

    const payload = {
      student: {
        id: Number(editFormData.studentId),
      },
      classroom: {
        id: Number(editFormData.classroomId),
      },
      enrollmentDate: editFormData.enrollmentDate,
      active: editFormData.active,
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/enrollments/${enrollmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (response.status === 404) {
        setError('Η εγγραφή δεν βρέθηκε.')
        return
      }

      if (!response.ok) {
        const errorMessage = await response.text()

        setError(
          errorMessage ||
            'Δεν ήταν δυνατή η ενημέρωση της εγγραφής.'
        )

        return
      }

      setMessage('Η εγγραφή ενημερώθηκε επιτυχώς.')
      setEditingEnrollmentId(null)

      await fetchEnrollments()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η ενημέρωση της εγγραφής.')
    }
  }

  const handleDelete = async (enrollmentId) => {
    const confirmed = window.confirm(
      'Θέλεις σίγουρα να διαγράψεις αυτή την εγγραφή;'
    )

    if (!confirmed) {
      return
    }

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/enrollments/${enrollmentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 404) {
        setError('Η εγγραφή δεν βρέθηκε.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to delete enrollment')
      }

      setMessage('Η εγγραφή διαγράφηκε επιτυχώς.')

      await fetchEnrollments()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η διαγραφή της εγγραφής.')
    }
  }

  return (
    <section>
      <hr />

      <h2>Εγγραφές Μαθητών σε Τάξεις</h2>

      <h3>Νέα Εγγραφή</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Μαθητής</label>

          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
          >
            <option value="">
              -- Επιλογή μαθητή --
            </option>

            {students.map((student) => (
              <option
                key={student.id}
                value={student.id}
              >
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Τάξη</label>

          <select
            name="classroomId"
            value={formData.classroomId}
            onChange={handleChange}
            required
          >
            <option value="">
              -- Επιλογή τάξης --
            </option>

            {classrooms.map((classroom) => (
              <option
                key={classroom.id}
                value={classroom.id}
              >
                {classroom.name} - {classroom.grade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Ημερομηνία εγγραφής</label>

          <input
            name="enrollmentDate"
            type="date"
            value={formData.enrollmentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>
            <input
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
            />

            Ενεργή εγγραφή
          </label>
        </div>

        <button type="submit">
          Εγγραφή Μαθητή
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <hr />

      <h3>Εγγραφές</h3>

      {enrollments.length === 0 && (
        <p>Δεν υπάρχουν εγγραφές.</p>
      )}

      {enrollments.map((enrollment) => (
        <div key={enrollment.id}>
          {editingEnrollmentId === enrollment.id ? (
            <form
              onSubmit={(e) =>
                handleUpdate(e, enrollment.id)
              }
            >
              <h3>Επεξεργασία Εγγραφής</h3>

              <div>
                <label>Μαθητής</label>

                <select
                  name="studentId"
                  value={editFormData.studentId}
                  onChange={handleEditChange}
                  required
                >
                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Τάξη</label>

                <select
                  name="classroomId"
                  value={editFormData.classroomId}
                  onChange={handleEditChange}
                  required
                >
                  {classrooms.map((classroom) => (
                    <option
                      key={classroom.id}
                      value={classroom.id}
                    >
                      {classroom.name} - {classroom.grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Ημερομηνία εγγραφής</label>

                <input
                  name="enrollmentDate"
                  type="date"
                  value={editFormData.enrollmentDate}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div>
                <label>
                  <input
                    name="active"
                    type="checkbox"
                    checked={editFormData.active}
                    onChange={handleEditChange}
                  />

                  Ενεργή εγγραφή
                </label>
              </div>

              <button type="submit">
                Αποθήκευση
              </button>

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
                {enrollment.student.firstName}{' '}
                {enrollment.student.lastName}
              </h3>

              <p>
                Τάξη: {enrollment.classroom.name}
              </p>

              <p>
                Βαθμίδα: {enrollment.classroom.grade}
              </p>

              <p>
                Ημερομηνία εγγραφής: {enrollment.enrollmentDate}
              </p>

              <p>
                Ενεργή: {enrollment.active ? 'Ναι' : 'Όχι'}
              </p>

              <button
                type="button"
                onClick={() => handleEdit(enrollment)}
              >
                Επεξεργασία
              </button>

              <button
                type="button"
                onClick={() => handleDelete(enrollment.id)}
              >
                Διαγραφή
              </button>
            </>
          )}

          <hr />
        </div>
      ))}
    </section>
  )
}

export default EnrollmentManagement