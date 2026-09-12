package gr.bigbangschool.management.repository;

import gr.bigbangschool.management.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}