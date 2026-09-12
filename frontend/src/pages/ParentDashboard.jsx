import { useEffect, useState } from 'react'
import LogoutButton from '../components/LogoutButton'

function ParentDashboard() {
  const [announcements, setAnnouncements] = useState([])
  const [attendances, setAttendances] = useState([])
  const [timetables, setTimetables] = useState([])

  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)
  const [loadingAttendances, setLoadingAttendances] = useState(true)
  const [loadingTimetables, setLoadingTimetables] = useState(true)

  const [announcementsError, setAnnouncementsError] = useState('')
  const [attendancesError, setAttendancesError] = useState('')
  const [timetablesError, setTimetablesError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/announcements/my-children',
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
        setAnnouncementsError(
          'Δεν ήταν δυνατή η φόρτωση των ανακοινώσεων.'
        )
      } finally {
        setLoadingAnnouncements(false)
      }
    }

    const fetchAttendances = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/attendances/my-children',
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
        setAttendancesError(
          'Δεν ήταν δυνατή η φόρτωση των παρουσιών.'
        )
      } finally {
        setLoadingAttendances(false)
      }
    }

    const fetchTimetables = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/timetables/my-children',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to load timetables')
        }

        const data = await response.json()
        setTimetables(data)
      } catch (error) {
        console.error(error)
        setTimetablesError(
          'Δεν ήταν δυνατή η φόρτωση του ωρολογίου προγράμματος.'
        )
      } finally {
        setLoadingTimetables(false)
      }
    }

    fetchAnnouncements()
    fetchAttendances()
    fetchTimetables()
  }, [])

  return (
    <div>
      <h1>Parent Dashboard</h1>

      <LogoutButton />

      <p>Καλώς ήρθατε στο περιβάλλον γονέα.</p>

      <section>
        <h2>Ανακοινώσεις</h2>

        {loadingAnnouncements && <p>Φόρτωση...</p>}

        {announcementsError && (
          <p>{announcementsError}</p>
        )}

        {!loadingAnnouncements &&
          !announcementsError &&
          announcements.length === 0 && (
            <p>Δεν υπάρχουν ανακοινώσεις.</p>
          )}

        {!loadingAnnouncements &&
          !announcementsError &&
          announcements.map((announcement) => (
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

      <section>
        <h2>Παρουσίες</h2>

        {loadingAttendances && <p>Φόρτωση...</p>}

        {attendancesError && (
          <p>{attendancesError}</p>
        )}

        {!loadingAttendances &&
          !attendancesError &&
          attendances.length === 0 && (
            <p>Δεν υπάρχουν καταχωρήσεις παρουσιών.</p>
          )}

        {!loadingAttendances &&
          !attendancesError &&
          attendances.map((attendance) => (
            <div key={attendance.id}>
              <h3>
                {attendance.student.firstName}{' '}
                {attendance.student.lastName}
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
        <h2>Ωρολόγιο Πρόγραμμα</h2>

        {loadingTimetables && <p>Φόρτωση...</p>}

        {timetablesError && (
          <p>{timetablesError}</p>
        )}

        {!loadingTimetables &&
          !timetablesError &&
          timetables.length === 0 && (
            <p>Δεν υπάρχει διαθέσιμο ωρολόγιο πρόγραμμα.</p>
          )}

        {!loadingTimetables &&
          !timetablesError &&
          timetables.map((timetable) => (
            <div key={timetable.id}>
              <h3>{timetable.schoolDay}</h3>

              <p>
                Ώρα: {timetable.startTime} - {timetable.endTime}
              </p>

              {timetable.teachingAssignment && (
                <>
                  <p>
                    Μάθημα:{' '}
                    {timetable.teachingAssignment.course?.name}
                  </p>

                  <p>
                    Τάξη:{' '}
                    {timetable.teachingAssignment.classroom?.name}
                  </p>

                  <p>
                    Εκπαιδευτικός:{' '}
                    {timetable.teachingAssignment.teacher?.user?.firstName}{' '}
                    {timetable.teachingAssignment.teacher?.user?.lastName}
                  </p>
                </>
              )}

              <hr />
            </div>
          ))}
      </section>
    </div>
  )
}

export default ParentDashboard