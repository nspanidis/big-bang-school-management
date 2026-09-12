package gr.bigbangschool.management.repository;

import gr.bigbangschool.management.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

}