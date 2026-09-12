import { useEffect, useState } from 'react'
import AttendanceManagement from '../components/AttendanceManagement'
import AnnouncementManagement from '../components/AnnouncementManagement'
import LogoutButton from '../components/LogoutButton'

function TeacherDashboard() {
  const [students, setStudents] = useState([])
  const [attendances, setAttendances] = useState([])
  const [announcements, setAnnouncements] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [
          studentsResponse,
          attendancesResponse,
          announcementsResponse,
        ] = await Promise.all([
          fetch('http://localhost:8080/api/students', { headers }),
          fetch('http://localhost:8080/api/attendances', { headers }),
          fetch('http://localhost:8080/api/announcements', { headers }),
        ])

        if (
          !studentsResponse.ok ||
          !attendancesResponse.ok ||
          !announcementsResponse.ok
        ) {
          throw new Error('Failed to load teacher dashboard data')
        }

        const studentsData = await studentsResponse.json()
        const attendancesData = await attendancesResponse.json()
        const announcementsData = await announcementsResponse.json()

        setStudents(studentsData)
        setAttendances(attendancesData)
        setAnnouncements(announcementsData)
      } catch (error) {
        console.error(error)

        setError(
          'Δεν ήταν δυνατή η φόρτωση των δεδομένων του εκπαιδευτικού.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <p>Φόρτωση...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h1>Teacher Dashboard</h1>

      <LogoutButton />

      <p>
        Καλώς ήρθατε στο περιβάλλον εκπαιδευτικού.
      </p>

      <section>
        <h2>Μαθητές</h2>

        {students.length === 0 && (
          <p>Δεν υπάρχουν μαθητές.</p>
        )}

        {students.map((student) => (
          <div key={student.id}>
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

            <hr />
          </div>
        ))}
      </section>

      <section>
        <h2>Παρουσίες</h2>

        {attendances.length === 0 && (
          <p>Δεν υπάρχουν καταχωρήσεις παρουσιών.</p>
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

            <hr />
          </div>
        ))}
      </section>

      <section>
        <h2>Ανακοινώσεις</h2>

        {announcements.length === 0 && (
          <p>Δεν υπάρχουν ανακοινώσεις.</p>
        )}

        {announcements.map((announcement) => (
          <div key={announcement.id}>
            <h3>{announcement.title}</h3>

            <p>{announcement.content}</p>

            {announcement.classroom && (
              <p>
                Τάξη: {announcement.classroom.name}
              </p>
            )}

            <hr />
          </div>
        ))}
      </section>

      <AttendanceManagement />
      <AnnouncementManagement />
    </div>
  )
}

export default TeacherDashboard