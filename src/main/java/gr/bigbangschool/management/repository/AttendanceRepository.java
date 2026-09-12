package gr.bigbangschool.management.repository;

import gr.bigbangschool.management.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    boolean existsByStudentIdAndDate(
            Long studentId,
            LocalDate date
    );
}