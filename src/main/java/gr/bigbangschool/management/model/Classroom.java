package gr.bigbangschool.management.model;

import jakarta.persistence.*;

/**
 * Represents a classroom in the school management system.
 *
 * A classroom is identified by its name, grade and school year.
 * It is used to organize students, enrollments, teaching assignments
 * and other classroom-related school activities.
 */
@Entity
@Table(name = "classrooms")
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String grade;

    @Column(name = "school_year", nullable = false)
    private String schoolYear;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSchoolYear() {
        return schoolYear;
    }

    public void setSchoolYear(String schoolYear) {
        this.schoolYear = schoolYear;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Classroom() {

    }
}
