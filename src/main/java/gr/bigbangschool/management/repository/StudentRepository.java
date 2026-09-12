package gr.bigbangschool.management.repository;

import gr.bigbangschool.management.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
