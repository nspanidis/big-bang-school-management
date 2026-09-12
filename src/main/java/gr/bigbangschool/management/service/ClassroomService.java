package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.Classroom;
import gr.bigbangschool.management.repository.ClassroomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Provides business logic for managing classrooms.
 *
 * The service handles classroom creation, retrieval, updates and deletion
 * and supports the organization of students, teachers and school activities.
 */
@Service
public class ClassroomService {

    private final ClassroomRepository classroomRepository;

    public ClassroomService(ClassroomRepository classroomRepository) {
        this.classroomRepository = classroomRepository;
    }

    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }

    public Optional<Classroom> getClassroomById(Long id) {
        return classroomRepository.findById(id);
    }

    public Classroom createClassroom(Classroom classroom) {
        return classroomRepository.save(classroom);
    }

    public Classroom updateClassroom(
            Long id,
            Classroom updatedClassroom) {

        Classroom existingClassroom =
                classroomRepository.findById(id).orElse(null);

        if (existingClassroom == null) {
            return null;
        }

        existingClassroom.setName(
                updatedClassroom.getName()
        );

        existingClassroom.setGrade(
                updatedClassroom.getGrade()
        );

        existingClassroom.setSchoolYear(
                updatedClassroom.getSchoolYear()
        );

        return classroomRepository.save(existingClassroom);
    }

    public boolean deleteClassroom(Long id) {

        if (!classroomRepository.existsById(id)) {
            return false;
        }

        classroomRepository.deleteById(id);

        return true;
    }
}