package gr.bigbangschool.management.repository;

import gr.bigbangschool.management.model.TeachingAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeachingAssignmentRepository
        extends JpaRepository<TeachingAssignment, Long> {
}