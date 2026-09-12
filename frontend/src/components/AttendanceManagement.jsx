import { useEffect, useState } from 'react'

function AttendanceManagement() {
  const [students, setStudents] = useState([])
  const [attendances, setAttendances] = useState([])

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    studentId: '',
    date: '',
    status: 'PRESENT',
    notes: '',
  })

  const token = localStorage.getItem('token')

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

  const fetchAttendances = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/attendances',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load attendances')
      }

      const data = await response.json()
      setAttendances(data)
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η φόρτωση των παρουσιών.')
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchAttendances()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      date: formData.date,
      status: formData.status,
      notes: formData.notes,
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/attendances',
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
            'Δεν ήταν δυνατή η καταχώρηση της παρουσίας.'
        )

        return
      }

      setMessage('Η παρουσία καταχωρήθηκε επιτυχώς.')

      setFormData({
        studentId: '',
        date: '',
        status: 'PRESENT',
        notes: '',
      })

      await fetchAttendances()
    } catch (error) {
      console.error(error)

      setError(
        'Δεν ήταν δυνατή η σύνδεση με τον server.'
      )
    }
  }

  const handleDelete = async (attendanceId) => {
    const confirmed = window.confirm(
      'Θέλεις σίγουρα να διαγράψεις αυτή την καταχώρηση παρουσίας;'
    )

    if (!confirmed) {
      return
    }

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/attendances/${attendanceId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 404) {
        setError('Η παρουσία δεν βρέθηκε.')
        return
      }

      if (!response.ok) {
        const errorMessage = await response.text()

        setError(
          errorMessage ||
            'Δεν ήταν δυνατή η διαγραφή της παρουσίας.'
        )

        return
      }

      setMessage('Η παρουσία διαγράφηκε επιτυχώς.')

      await fetchAttendances()
    } catch (error) {
      console.error(error)

      setError(
        'Δεν ήταν δυνατή η σύνδεση με τον server.'
      )
    }
  }

  return (
    <section>
      <hr />

      <h2>Διαχείριση Παρουσιών</h2>

      <h3>Νέα Καταχώρηση</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="attendanceStudent">
            Μαθητής
          </label>

          <select
            id="attendanceStudent"
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
          <label htmlFor="attendanceDate">
            Ημερομηνία
          </label>

          <input
            id="attendanceDate"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="attendanceStatus">
            Κατάσταση
          </label>

          <select
            id="attendanceStatus"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="PRESENT">
              PRESENT
            </option>

            <option value="ABSENT">
              ABSENT
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="attendanceNotes">
            Σημειώσεις
          </label>

          <input
            id="attendanceNotes"
            name="notes"
            type="text"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Προαιρετικές σημειώσεις"
          />
        </div>

        <button type="submit">
          Καταχώρηση Παρουσίας
        </button>
      </form>

      {message && (
        <p>
          {message}
        </p>
      )}

      {error && (
        <p>
          {error}
        </p>
      )}

      <hr />

      <h3>Παρουσίες</h3>

      {attendances.length === 0 && (
        <p>
          Δεν υπάρχουν καταχωρήσεις παρουσιών.
        </p>
      )}

      {attendances.map((attendance) => (
        <div key={attendance.id}>
          <h3>
            {attendance.student?.firstName}{' '}
            {attendance.student?.lastName}
          </h3>

          <p>
            Ημερομηνία: {attendance.date}
          </p>

          <p>
            Κατάσταση: {attendance.status}
          </p>

          {attendance.notes && (
            <p>
              Σημειώσεις: {attendance.notes}
            </p>
          )}

          <button
            type="button"
            onClick={() =>
              handleDelete(attendance.id)
            }
          >
            Διαγραφή
          </button>

          <hr />
        </div>
      ))}
    </section>
  )
}

export default AttendanceManagement