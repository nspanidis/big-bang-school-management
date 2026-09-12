package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.Classroom;
import gr.bigbangschool.management.model.Enrollment;
import gr.bigbangschool.management.model.Student;
import gr.bigbangschool.management.repository.ClassroomRepository;
import gr.bigbangschool.management.repository.EnrollmentRepository;
import gr.bigbangschool.management.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Provides business logic for student classroom enrollments.
 *
 * The service manages enrollment creation, updates and deletion
 * while validating referenced students and classrooms.
 */
@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final ClassroomRepository classroomRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            ClassroomRepository classroomRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.classroomRepository = classroomRepository;
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public Optional<Enrollment> getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id);
    }

    /**
     * Creates a new student enrollment.
     *
     * The student and classroom must exist. The service also prevents
     * creation of a duplicate active enrollment for the same student
     * and classroom.
     *
     * @param enrollment the enrollment to create
     * @return the saved enrollment, or null when validation fails
     */
    public Enrollment createEnrollment(Enrollment enrollment) {

        if (enrollment.getStudent() == null
                || enrollment.getClassroom() == null) {
            return null;
        }

        Long studentId = enrollment.getStudent().getId();
        Long classroomId = enrollment.getClassroom().getId();

        if (studentId == null || classroomId == null) {
            return null;
        }

        Student existingStudent =
                studentRepository.findById(studentId).orElse(null);

        Classroom existingClassroom =
                classroomRepository.findById(classroomId).orElse(null);

        if (existingStudent == null || existingClassroom == null) {
            return null;
        }

        if (enrollment.isActive()) {

            boolean alreadyEnrolled =
                    enrollmentRepository
                            .existsByStudentIdAndClassroomIdAndActiveTrue(
                                    studentId,
                                    classroomId
                            );

            if (alreadyEnrolled) {
                return null;
            }
        }

        enrollment.setStudent(existingStudent);
        enrollment.setClassroom(existingClassroom);

        return enrollmentRepository.save(enrollment);
    }

    /**
     * Updates an existing enrollment.
     *
     * The referenced student and classroom must exist before
     * the enrollment can be updated.
     *
     * @param id the enrollment identifier
     * @param updatedEnrollment the new enrollment data
     * @return the updated enrollment, or null when validation fails
     */
    public Enrollment updateEnrollment(
            Long id,
            Enrollment updatedEnrollment) {

        Enrollment existingEnrollment =
                enrollmentRepository.findById(id).orElse(null);

        if (existingEnrollment == null) {
            return null;
        }

        if (updatedEnrollment.getStudent() == null
                || updatedEnrollment.getClassroom() == null) {
            return null;
        }

        Long studentId =
                updatedEnrollment.getStudent().getId();

        Long classroomId =
                updatedEnrollment.getClassroom().getId();

        if (studentId == null || classroomId == null) {
            return null;
        }

        Student existingStudent =
                studentRepository.findById(studentId).orElse(null);

        Classroom existingClassroom =
                classroomRepository.findById(classroomId).orElse(null);

        if (existingStudent == null || existingClassroom == null) {
            return null;
        }

        if (updatedEnrollment.isActive()) {

            boolean duplicateActiveEnrollment =
                    enrollmentRepository
                            .existsByStudentIdAndClassroomIdAndActiveTrueAndIdNot(
                                    studentId,
                                    classroomId,
                                    id
                            );

            if (duplicateActiveEnrollment) {
                return null;
            }
        }

        existingEnrollment.setStudent(existingStudent);
        existingEnrollment.setClassroom(existingClassroom);

        existingEnrollment.setEnrollmentDate(
                updatedEnrollment.getEnrollmentDate()
        );

        existingEnrollment.setActive(
                updatedEnrollment.isActive()
        );

        return enrollmentRepository.save(existingEnrollment);
    }

    public boolean deleteEnrollment(Long id) {

        if (!enrollmentRepository.existsById(id)) {
            return false;
        }

        enrollmentRepository.deleteById(id);

        return true;
    }
}