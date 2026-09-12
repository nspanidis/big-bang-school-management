package gr.bigbangschool.management.controller;

import gr.bigbangschool.management.model.Classroom;
import gr.bigbangschool.management.service.ClassroomService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * REST controller for managing classrooms.
 *
 * Provides endpoints for creating, retrieving, updating
 * and deleting classroom records.
 */
@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {

    private final ClassroomService classroomService;

    public ClassroomController(
            ClassroomService classroomService) {

        this.classroomService = classroomService;
    }

    @GetMapping
    public List<Classroom> getAllClassrooms() {
        return classroomService.getAllClassrooms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Classroom> getClassroomById(
            @PathVariable Long id) {

        return classroomService.getClassroomById(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    @PostMapping
    public Classroom createClassroom(
            @RequestBody Classroom classroom) {

        return classroomService.createClassroom(classroom);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Classroom> updateClassroom(
            @PathVariable Long id,
            @RequestBody Classroom classroom) {

        Classroom updatedClassroom =
                classroomService.updateClassroom(
                        id,
                        classroom
                );

        if (updatedClassroom == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedClassroom);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassroom(
            @PathVariable Long id) {

        boolean deleted =
                classroomService.deleteClassroom(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}