package gr.bigbangschool.management.model;

import jakarta.persistence.*;

import java.time.LocalTime;

/**
 * Represents a scheduled lesson in the school timetable.
 *
 * A timetable entry defines when a teaching assignment takes place,
 * including the school day, start time and end time. Through the
 * teaching assignment, it connects a teacher, course and classroom.
 */
@Entity
@Table(name = "timetable")
public class Timetable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teaching_assignment_id", nullable = false)
    private TeachingAssignment teachingAssignment;

    @Enumerated(EnumType.STRING)
    @Column(name = "school_day", nullable = false)
    private SchoolDay schoolDay;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TeachingAssignment getTeachingAssignment() {
        return teachingAssignment;
    }

    public void setTeachingAssignment(TeachingAssignment teachingAssignment) {
        this.teachingAssignment = teachingAssignment;
    }

    public SchoolDay getSchoolDay() {
        return schoolDay;
    }

    public void setSchoolDay(SchoolDay schoolDay) {
        this.schoolDay = schoolDay;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Timetable() {

    }
}
