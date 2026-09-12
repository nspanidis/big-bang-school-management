import { useEffect, useState } from 'react'

function ClassroomManagement() {
  const [classrooms, setClassrooms] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingClassroomId, setEditingClassroomId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    schoolYear: '',
  })

  const [editFormData, setEditFormData] = useState({
    name: '',
    grade: '',
    schoolYear: '',
  })

  const token = localStorage.getItem('token')

  // =========================
  // LOAD CLASSROOMS
  // =========================

  const fetchClassrooms = async () => {
    setError('')

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
      setError('Δεν ήταν δυνατή η φόρτωση των τάξεων.')
    }
  }

  // =========================
  // CREATE CLASSROOM
  // =========================

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

    try {
      const response = await fetch(
        'http://localhost:8080/api/classrooms',
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
        throw new Error('Failed to create classroom')
      }

      setMessage('Η τάξη δημιουργήθηκε επιτυχώς.')

      setFormData({
        name: '',
        grade: '',
        schoolYear: '',
      })

      await fetchClassrooms()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η δημιουργία της τάξης.')
    }
  }

  // =========================
  // EDIT CLASSROOM
  // =========================

  const handleEdit = (classroom) => {
    setMessage('')
    setError('')

    setEditingClassroomId(classroom.id)

    setEditFormData({
      name: classroom.name,
      grade: classroom.grade,
      schoolYear: classroom.schoolYear,
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCancelEdit = () => {
    setEditingClassroomId(null)

    setEditFormData({
      name: '',
      grade: '',
      schoolYear: '',
    })
  }

  // =========================
  // UPDATE CLASSROOM
  // =========================

  const handleUpdate = async (e, classroomId) => {
    e.preventDefault()

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/classrooms/${classroomId}`,
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
        setError('Η τάξη δεν βρέθηκε.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to update classroom')
      }

      setMessage('Η τάξη ενημερώθηκε επιτυχώς.')
      setEditingClassroomId(null)

      await fetchClassrooms()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η ενημέρωση της τάξης.')
    }
  }

  // =========================
  // DELETE CLASSROOM
  // =========================

  const handleDelete = async (classroomId) => {
    const confirmed = window.confirm(
      'Θέλεις σίγουρα να διαγράψεις αυτή την τάξη;'
    )

    if (!confirmed) {
      return
    }

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/classrooms/${classroomId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 404) {
        setError('Η τάξη δεν βρέθηκε.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to delete classroom')
      }

      setMessage('Η τάξη διαγράφηκε επιτυχώς.')

      await fetchClassrooms()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η διαγραφή της τάξης.')
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchClassrooms()
  }, [])

  return (
    <section>
      <hr />

      <h2>Διαχείριση Τάξεων</h2>

      {/* CREATE CLASSROOM */}

      <h3>Νέα Τάξη</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="classroomName">
            Όνομα τάξης
          </label>

          <input
            id="classroomName"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="π.χ. A1"
            required
          />
        </div>

        <div>
          <label htmlFor="classroomGrade">
            Τάξη / Βαθμίδα
          </label>

          <input
            id="classroomGrade"
            name="grade"
            type="text"
            value={formData.grade}
            onChange={handleChange}
            placeholder="π.χ. Α' Δημοτικού"
            required
          />
        </div>

        <div>
          <label htmlFor="classroomSchoolYear">
            Σχολικό έτος
          </label>

          <input
            id="classroomSchoolYear"
            name="schoolYear"
            type="text"
            value={formData.schoolYear}
            onChange={handleChange}
            placeholder="π.χ. 2026-2027"
            required
          />
        </div>

        <button type="submit">
          Δημιουργία Τάξης
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <hr />

      {/* CLASSROOM LIST */}

      <h3>Τάξεις</h3>

      {classrooms.length === 0 && (
        <p>Δεν υπάρχουν τάξεις.</p>
      )}

      {classrooms.map((classroom) => (
        <div key={classroom.id}>
          {editingClassroomId === classroom.id ? (
            <form
              onSubmit={(e) =>
                handleUpdate(e, classroom.id)
              }
            >
              <h3>Επεξεργασία Τάξης</h3>

              <div>
                <label>Όνομα τάξης</label>

                <input
                  name="name"
                  type="text"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div>
                <label>Τάξη / Βαθμίδα</label>

                <input
                  name="grade"
                  type="text"
                  value={editFormData.grade}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div>
                <label>Σχολικό έτος</label>

                <input
                  name="schoolYear"
                  type="text"
                  value={editFormData.schoolYear}
                  onChange={handleEditChange}
                  required
                />
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
              <h3>{classroom.name}</h3>

              <p>
                Τάξη / Βαθμίδα: {classroom.grade}
              </p>

              <p>
                Σχολικό έτος: {classroom.schoolYear}
              </p>

              <button
                type="button"
                onClick={() => handleEdit(classroom)}
              >
                Επεξεργασία
              </button>

              <button
                type="button"
                onClick={() => handleDelete(classroom.id)}
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

export default ClassroomManagement