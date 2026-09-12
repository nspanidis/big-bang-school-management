package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.Attendance;
import gr.bigbangschool.management.model.Student;
import gr.bigbangschool.management.repository.AttendanceRepository;
import gr.bigbangschool.management.repository.StudentRepository;
import gr.bigbangschool.management.model.ParentStudent;
import gr.bigbangschool.management.repository.ParentStudentRepository;
import gr.bigbangschool.management.model.Parent;
import gr.bigbangschool.management.model.User;
import gr.bigbangschool.management.repository.ParentRepository;
import gr.bigbangschool.management.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Provides business logic for student attendance management.
 *
 * The service retrieves, creates and deletes attendance records
 * and also provides parent-specific attendance information
 * for the parent's linked children.
 */
@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final ParentStudentRepository parentStudentRepository;
    private final ParentRepository parentRepository;
    private final UserRepository userRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            StudentRepository studentRepository,
            ParentStudentRepository parentStudentRepository,
            ParentRepository parentRepository,
            UserRepository userRepository) {

        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.parentStudentRepository = parentStudentRepository;
        this.parentRepository = parentRepository;
        this.userRepository = userRepository;
    }

    public List<Attendance> getAllAttendances() {
        return attendanceRepository.findAll();
    }

    public Optional<Attendance> getAttendanceById(Long id) {
        return attendanceRepository.findById(id);
    }

    public List<Attendance> getAttendancesByParentId(Long parentId) {

        List<ParentStudent> parentStudents =
                parentStudentRepository.findByParentId(parentId);

        return parentStudents.stream()
                .flatMap(parentStudent ->
                        attendanceRepository
                                .findByStudentId(parentStudent.getStudent().getId())
                                .stream()
                )
                .toList();
    }

    /**
     * Retrieves attendance records for all students linked
     * to the authenticated parent account.
     *
     * @param email the email address of the authenticated parent
     * @return attendance records for the parent's children
     */
    public List<Attendance> getAttendancesForParent(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return List.of();
        }

        Parent parent = parentRepository.findByUserId(user.getId()).orElse(null);

        if (parent == null) {
            return List.of();
        }

        return getAttendancesByParentId(parent.getId());
    }

    /**
     * Creates a new attendance record for an existing student.
     *
     * @param attendance the attendance record to create
     * @return the saved attendance record, or null if the student does not exist
     */
    public Attendance createAttendance(Attendance attendance) {

        Long studentId = attendance.getStudent().getId();

        Student existingStudent =
                studentRepository.findById(studentId).orElse(null);

        if (existingStudent == null) {
            return null;
        }

        boolean attendanceAlreadyExists =
                attendanceRepository.existsByStudentIdAndDate(
                        studentId,
                        attendance.getDate()
                );

        if (attendanceAlreadyExists) {
            return null;
        }

        attendance.setStudent(existingStudent);

        return attendanceRepository.save(attendance);
    }

    public boolean deleteAttendance(Long id) {

        if (!attendanceRepository.existsById(id)) {
            return false;
        }

        attendanceRepository.deleteById(id);
        return true;
    }
}