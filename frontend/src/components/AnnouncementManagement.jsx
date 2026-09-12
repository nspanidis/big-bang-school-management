import { useEffect, useState } from 'react'

function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState([])
  const [classrooms, setClassrooms] = useState([])

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [editingAnnouncementId, setEditingAnnouncementId] =
    useState(null)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    classroomId: '',
  })

  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    classroomId: '',
  })

  const token = localStorage.getItem('token')

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/announcements',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load announcements')
      }

      const data = await response.json()
      setAnnouncements(data)
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η φόρτωση των ανακοινώσεων.')
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
      setError('Δεν ήταν δυνατή η φόρτωση των τάξεων.')
    }
  }

  useEffect(() => {
    fetchAnnouncements()
    fetchClassrooms()
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
      title: formData.title,
      content: formData.content,
      classroom: formData.classroomId
        ? { id: Number(formData.classroomId) }
        : null,
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/announcements',
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
        throw new Error('Failed to create announcement')
      }

      setMessage('Η ανακοίνωση δημιουργήθηκε επιτυχώς.')

      setFormData({
        title: '',
        content: '',
        classroomId: '',
      })

      await fetchAnnouncements()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η δημιουργία της ανακοίνωσης.')
    }
  }

  const handleEdit = (announcement) => {
    setMessage('')
    setError('')

    setEditingAnnouncementId(announcement.id)

    setEditFormData({
      title: announcement.title,
      content: announcement.content,
      classroomId: announcement.classroom?.id ?? '',
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
    setEditingAnnouncementId(null)

    setEditFormData({
      title: '',
      content: '',
      classroomId: '',
    })
  }

  const handleUpdate = async (e, announcementId) => {
    e.preventDefault()

    setMessage('')
    setError('')

    const payload = {
      title: editFormData.title,
      content: editFormData.content,
      classroom: editFormData.classroomId
        ? { id: Number(editFormData.classroomId) }
        : null,
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/announcements/${announcementId}`,
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
        setError('Η ανακοίνωση δεν βρέθηκε.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to update announcement')
      }

      setMessage('Η ανακοίνωση ενημερώθηκε επιτυχώς.')
      setEditingAnnouncementId(null)

      await fetchAnnouncements()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η ενημέρωση της ανακοίνωσης.')
    }
  }

  const handleDelete = async (announcementId) => {
    const confirmed = window.confirm(
      'Θέλεις σίγουρα να διαγράψεις αυτή την ανακοίνωση;'
    )

    if (!confirmed) {
      return
    }

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/announcements/${announcementId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 404) {
        setError('Η ανακοίνωση δεν βρέθηκε.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to delete announcement')
      }

      setMessage('Η ανακοίνωση διαγράφηκε επιτυχώς.')

      await fetchAnnouncements()
    } catch (error) {
      console.error(error)
      setError('Δεν ήταν δυνατή η διαγραφή της ανακοίνωσης.')
    }
  }

  return (
    <section>
      <hr />

      <h2>Διαχείριση Ανακοινώσεων</h2>

      <h3>Νέα Ανακοίνωση</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Τίτλος</label>

          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Περιεχόμενο</label>

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Τάξη</label>

          <select
            name="classroomId"
            value={formData.classroomId}
            onChange={handleChange}
          >
            <option value="">
              Όλες οι τάξεις
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

        <button type="submit">
          Δημοσίευση Ανακοίνωσης
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <hr />

      <h3>Ανακοινώσεις</h3>

      {announcements.length === 0 && (
        <p>Δεν υπάρχουν ανακοινώσεις.</p>
      )}

      {announcements.map((announcement) => (
        <div key={announcement.id}>
          {editingAnnouncementId === announcement.id ? (
            <form
              onSubmit={(e) =>
                handleUpdate(e, announcement.id)
              }
            >
              <h3>Επεξεργασία Ανακοίνωσης</h3>

              <div>
                <label>Τίτλος</label>

                <input
                  name="title"
                  type="text"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div>
                <label>Περιεχόμενο</label>

                <textarea
                  name="content"
                  value={editFormData.content}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div>
                <label>Τάξη</label>

                <select
                  name="classroomId"
                  value={editFormData.classroomId}
                  onChange={handleEditChange}
                >
                  <option value="">
                    Όλες οι τάξεις
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
              <h3>{announcement.title}</h3>

              <p>{announcement.content}</p>

              <p>
                Τάξη:{' '}
                {announcement.classroom
                  ? announcement.classroom.name
                  : 'Όλες οι τάξεις'}
              </p>

              {announcement.createdBy && (
                <p>
                  Δημιουργός:{' '}
                  {announcement.createdBy.firstName}{' '}
                  {announcement.createdBy.lastName}
                </p>
              )}

              <button
                type="button"
                onClick={() => handleEdit(announcement)}
              >
                Επεξεργασία
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(announcement.id)
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
  )
}

export default AnnouncementManagement