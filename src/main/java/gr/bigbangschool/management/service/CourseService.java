package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.Course;
import gr.bigbangschool.management.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Provides business logic for managing school courses.
 *
 * The service handles course creation, retrieval, updates and deletion
 * and supports the connection of courses with teachers and classrooms
 * through teaching assignments.
 */
@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public boolean deleteCourse(Long id) {

        if (!courseRepository.existsById(id)) {
            return false;
        }

        courseRepository.deleteById(id);
        return true;
    }
}