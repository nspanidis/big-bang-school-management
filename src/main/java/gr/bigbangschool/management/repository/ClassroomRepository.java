package gr.bigbangschool.management.repository;

import gr.bigbangschool.management.model.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
}