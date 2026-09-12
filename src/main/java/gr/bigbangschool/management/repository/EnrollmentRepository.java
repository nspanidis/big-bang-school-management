package gr.bigbangschool.management.repository;

import gr.bigbangschool.management.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudentId(Long studentId);

    List<Enrollment> findByStudentIdAndActiveTrue(Long studentId);

    boolean existsByStudentIdAndClassroomIdAndActiveTrue(
            Long studentId,
            Long classroomId
    );

    boolean existsByStudentIdAndClassroomIdAndActiveTrueAndIdNot(
            Long studentId,
            Long classroomId,
            Long id
    );
}