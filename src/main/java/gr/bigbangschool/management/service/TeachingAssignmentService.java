package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.Classroom;
import gr.bigbangschool.management.model.Course;
import gr.bigbangschool.management.model.Teacher;
import gr.bigbangschool.management.model.TeachingAssignment;
import gr.bigbangschool.management.repository.ClassroomRepository;
import gr.bigbangschool.management.repository.CourseRepository;
import gr.bigbangschool.management.repository.TeacherRepository;
import gr.bigbangschool.management.repository.TeachingAssignmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeachingAssignmentService {

    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final ClassroomRepository classroomRepository;

    public TeachingAssignmentService(
            TeachingAssignmentRepository teachingAssignmentRepository,
            TeacherRepository teacherRepository,
            CourseRepository courseRepository,
            ClassroomRepository classroomRepository) {

        this.teachingAssignmentRepository = teachingAssignmentRepository;
        this.teacherRepository = teacherRepository;
        this.courseRepository = courseRepository;
        this.classroomRepository = classroomRepository;
    }

    public List<TeachingAssignment> getAllTeachingAssignments() {
        return teachingAssignmentRepository.findAll();
    }

    public Optional<TeachingAssignment> getTeachingAssignmentById(Long id) {
        return teachingAssignmentRepository.findById(id);
    }

    public TeachingAssignment createTeachingAssignment(TeachingAssignment teachingAssignment) {

        Long teacherId = teachingAssignment.getTeacher().getId();
        Long courseId = teachingAssignment.getCourse().getId();
        Long classroomId = teachingAssignment.getClassroom().getId();

        Teacher existingTeacher = teacherRepository.findById(teacherId).orElse(null);
        Course existingCourse = courseRepository.findById(courseId).orElse(null);
        Classroom existingClassroom = classroomRepository.findById(classroomId).orElse(null);

        if (existingTeacher == null || existingCourse == null || existingClassroom == null) {
            return null;
        }

        teachingAssignment.setTeacher(existingTeacher);
        teachingAssignment.setCourse(existingCourse);
        teachingAssignment.setClassroom(existingClassroom);

        return teachingAssignmentRepository.save(teachingAssignment);
    }

    public boolean deleteTeachingAssignment(Long id) {

        if (!teachingAssignmentRepository.existsById(id)) {
            return false;
        }

        teachingAssignmentRepository.deleteById(id);
        return true;
    }
}
