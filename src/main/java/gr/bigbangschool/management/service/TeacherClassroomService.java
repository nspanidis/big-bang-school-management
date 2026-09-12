package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.Classroom;
import gr.bigbangschool.management.model.Teacher;
import gr.bigbangschool.management.model.TeacherClassroom;
import gr.bigbangschool.management.repository.ClassroomRepository;
import gr.bigbangschool.management.repository.TeacherClassroomRepository;
import gr.bigbangschool.management.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeacherClassroomService {

    private final TeacherClassroomRepository teacherClassroomRepository;
    private final TeacherRepository teacherRepository;
    private final ClassroomRepository classroomRepository;

    public TeacherClassroomService(
            TeacherClassroomRepository teacherClassroomRepository,
            TeacherRepository teacherRepository,
            ClassroomRepository classroomRepository) {

        this.teacherClassroomRepository = teacherClassroomRepository;
        this.teacherRepository = teacherRepository;
        this.classroomRepository = classroomRepository;
    }

    public List<TeacherClassroom> getAllTeacherClassrooms() {
        return teacherClassroomRepository.findAll();
    }

    public Optional<TeacherClassroom> getTeacherClassroomById(Long id) {
        return teacherClassroomRepository.findById(id);
    }

    public TeacherClassroom createTeacherClassroom(TeacherClassroom teacherClassroom) {

        Long teacherId = teacherClassroom.getTeacher().getId();
        Long classroomId = teacherClassroom.getClassroom().getId();

        Teacher existingTeacher = teacherRepository.findById(teacherId).orElse(null);
        Classroom existingClassroom = classroomRepository.findById(classroomId).orElse(null);

        if (existingTeacher == null || existingClassroom == null) {
            return null;
        }

        teacherClassroom.setTeacher(existingTeacher);
        teacherClassroom.setClassroom(existingClassroom);

        return teacherClassroomRepository.save(teacherClassroom);
    }

    public boolean deleteTeacherClassroom(Long id) {

        if (!teacherClassroomRepository.existsById(id)) {
            return false;
        }

        teacherClassroomRepository.deleteById(id);
        return true;
    }
}