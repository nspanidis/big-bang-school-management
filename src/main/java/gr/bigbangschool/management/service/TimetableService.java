package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.Classroom;
import gr.bigbangschool.management.model.Enrollment;
import gr.bigbangschool.management.model.Parent;
import gr.bigbangschool.management.model.ParentStudent;
import gr.bigbangschool.management.model.TeachingAssignment;
import gr.bigbangschool.management.model.Timetable;
import gr.bigbangschool.management.model.User;

import gr.bigbangschool.management.repository.EnrollmentRepository;
import gr.bigbangschool.management.repository.ParentRepository;
import gr.bigbangschool.management.repository.ParentStudentRepository;
import gr.bigbangschool.management.repository.TeachingAssignmentRepository;
import gr.bigbangschool.management.repository.TimetableRepository;
import gr.bigbangschool.management.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Provides business logic for managing the school timetable.
 *
 * The service handles timetable entries and provides access
 * to scheduled lessons. It also supports parent-specific timetable
 * information based on the classrooms of their linked children.
 */
@Service
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final ParentStudentRepository parentStudentRepository;
    private final EnrollmentRepository enrollmentRepository;

    public TimetableService(
            TimetableRepository timetableRepository,
            TeachingAssignmentRepository teachingAssignmentRepository,
            UserRepository userRepository,
            ParentRepository parentRepository,
            ParentStudentRepository parentStudentRepository,
            EnrollmentRepository enrollmentRepository) {

        this.timetableRepository = timetableRepository;
        this.teachingAssignmentRepository = teachingAssignmentRepository;
        this.userRepository = userRepository;
        this.parentRepository = parentRepository;
        this.parentStudentRepository = parentStudentRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<Timetable> getAllTimetables() {
        return timetableRepository.findAll();
    }

    public Optional<Timetable> getTimetableById(Long id) {
        return timetableRepository.findById(id);
    }

    public List<Timetable> getTimetablesForParent(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return List.of();
        }

        Parent parent = parentRepository.findByUserId(user.getId()).orElse(null);

        if (parent == null) {
            return List.of();
        }

        List<ParentStudent> parentStudents =
                parentStudentRepository.findByParentId(parent.getId());

        List<Long> classroomIds = parentStudents.stream()
                .flatMap(parentStudent ->
                        enrollmentRepository
                                .findByStudentIdAndActiveTrue(
                                        parentStudent.getStudent().getId()
                                )
                                .stream()
                )
                .map(Enrollment::getClassroom)
                .map(Classroom::getId)
                .distinct()
                .toList();

        return timetableRepository
                .findByTeachingAssignmentClassroomIdIn(classroomIds);
    }

    public Timetable createTimetable(Timetable timetable) {

        Long teachingAssignmentId =
                timetable.getTeachingAssignment().getId();

        TeachingAssignment existingTeachingAssignment =
                teachingAssignmentRepository
                        .findById(teachingAssignmentId)
                        .orElse(null);

        if (existingTeachingAssignment == null) {
            return null;
        }

        timetable.setTeachingAssignment(existingTeachingAssignment);

        return timetableRepository.save(timetable);
    }

    public boolean deleteTimetable(Long id) {

        if (!timetableRepository.existsById(id)) {
            return false;
        }

        timetableRepository.deleteById(id);
        return true;
    }
}