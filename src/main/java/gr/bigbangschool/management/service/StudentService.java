package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.Student;
import gr.bigbangschool.management.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Provides business logic for managing students.
 *
 * The service handles student creation, retrieval, updates and deletion
 * and validates the student data before interacting with the repository.
 */
@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public boolean deleteStudent(Long id) {

        if (!studentRepository.existsById(id)) {
            return false;
        }

        studentRepository.deleteById(id);
        return true;
    }

    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = studentRepository.findById(id).orElse(null);
        if (existingStudent == null) {
            return null;
        }

        existingStudent.setFirstName(updatedStudent.getFirstName());
        existingStudent.setLastName(updatedStudent.getLastName());
        existingStudent.setDateOfBirth(updatedStudent.getDateOfBirth());
        existingStudent.setRegistrationNumber(updatedStudent.getRegistrationNumber());
        existingStudent.setActive(updatedStudent.isActive());

        return studentRepository.save(existingStudent);
    }
}
