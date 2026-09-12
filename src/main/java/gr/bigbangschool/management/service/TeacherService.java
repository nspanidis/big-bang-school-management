package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.Teacher;
import gr.bigbangschool.management.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Provides business logic for managing teachers.
 *
 * The service handles teacher data and the association between
 * teacher profiles and their corresponding application user accounts.
 */
@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Optional<Teacher> getTeacherById(Long id) {
        return teacherRepository.findById(id);
    }

    public Teacher createTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    public boolean deleteTeacher(Long id) {

        if (!teacherRepository.existsById(id)) {
            return false;
        }

        teacherRepository.deleteById(id);
        return true;
    }

    public Teacher updateTeacher(Long id, Teacher updatedTeacher) {

        Teacher existingTeacher = teacherRepository.findById(id).orElse(null);

        if (existingTeacher == null) {
            return null;
        }

        existingTeacher.setUser(updatedTeacher.getUser());
        existingTeacher.setPhone(updatedTeacher.getPhone());
        existingTeacher.setSpecialty(updatedTeacher.getSpecialty());

        return teacherRepository.save(existingTeacher);
    }
}
