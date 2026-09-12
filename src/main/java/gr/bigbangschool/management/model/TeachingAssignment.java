package gr.bigbangschool.management.model;

import jakarta.persistence.*;

/**
 * Represents a teaching assignment in the school.
 *
 * A teaching assignment connects a teacher with a course
 * and a classroom. It defines which teacher is responsible
 * for teaching a specific course to a specific classroom.
 */
@Entity
@Table(
        name = "teaching_assignments",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"teacher_id", "course_id", "classroom_id"})
        }
)
public class TeachingAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Classroom getClassroom() {
        return classroom;
    }

    public void setClassroom(Classroom classroom) {
        this.classroom = classroom;
    }

    public TeachingAssignment() {

    }
}
