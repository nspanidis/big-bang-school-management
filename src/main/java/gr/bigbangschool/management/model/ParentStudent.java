package gr.bigbangschool.management.model;

import jakarta.persistence.*;

/**
 * Represents the relationship between a parent and a student.
 *
 * This entity links parents to their children and allows the system
 * to determine which student information can be accessed by each
 * parent account.
 */
@Entity
@Table(
        name = "parent_students",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"parent_id", "student_id"})
        }
)
public class ParentStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Parent getParent() {
        return parent;
    }

    public void setParent(Parent parent) {
        this.parent = parent;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public ParentStudent() {

    }
}
