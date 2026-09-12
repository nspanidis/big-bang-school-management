package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.ParentStudent;
import gr.bigbangschool.management.repository.ParentStudentRepository;
import org.springframework.stereotype.Service;
import gr.bigbangschool.management.model.Parent;
import gr.bigbangschool.management.model.Student;
import gr.bigbangschool.management.repository.ParentRepository;
import gr.bigbangschool.management.repository.StudentRepository;

import java.util.List;
import java.util.Optional;

/**
 * Provides business logic for managing parent-student relationships.
 *
 * The service links parent profiles with students and supports
 * parent-specific access to information related to their children.
 */
@Service
public class ParentStudentService {

    private final ParentStudentRepository parentStudentRepository;
    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;

    public ParentStudentService(
            ParentStudentRepository parentStudentRepository,
            ParentRepository parentRepository,
            StudentRepository studentRepository) {

        this.parentStudentRepository = parentStudentRepository;
        this.parentRepository = parentRepository;
        this.studentRepository = studentRepository;
    }

    public List<ParentStudent> getAllParentStudents() {
        return parentStudentRepository.findAll();
    }

    public Optional<ParentStudent> getParentStudentById(Long id) {
        return parentStudentRepository.findById(id);
    }

    public ParentStudent createParentStudent(ParentStudent parentStudent) {

        Long parentId = parentStudent.getParent().getId();
        Long studentId = parentStudent.getStudent().getId();

        Parent existingParent = parentRepository.findById(parentId).orElse(null);
        Student existingStudent = studentRepository.findById(studentId).orElse(null);

        if (existingParent == null || existingStudent == null) {
            return null;
        }

        parentStudent.setParent(existingParent);
        parentStudent.setStudent(existingStudent);

        return parentStudentRepository.save(parentStudent);
    }

    public boolean deleteParentStudent(Long id) {

        if (!parentStudentRepository.existsById(id)) {
            return false;
        }

        parentStudentRepository.deleteById(id);
        return true;
    }
}
