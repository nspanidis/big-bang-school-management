package gr.bigbangschool.management.controller;

import gr.bigbangschool.management.model.TeachingAssignment;
import gr.bigbangschool.management.service.TeachingAssignmentService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * REST controller for managing teaching assignments.
 *
 * Provides endpoints for creating, retrieving and deleting
 * assignments that connect teachers, courses and classrooms.
 */
@RestController
@RequestMapping("/api/teaching-assignments")
public class TeachingAssignmentController {

    private final TeachingAssignmentService teachingAssignmentService;

    public TeachingAssignmentController(TeachingAssignmentService teachingAssignmentService) {
        this.teachingAssignmentService = teachingAssignmentService;
    }

    @GetMapping
    public List<TeachingAssignment> getAllTeachingAssignments() {
        return teachingAssignmentService.getAllTeachingAssignments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeachingAssignment> getTeachingAssignmentById(
            @PathVariable Long id) {

        return teachingAssignmentService.getTeachingAssignmentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public TeachingAssignment createTeachingAssignment(
            @RequestBody TeachingAssignment teachingAssignment) {

        return teachingAssignmentService.createTeachingAssignment(teachingAssignment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeachingAssignment(@PathVariable Long id) {

        boolean deleted = teachingAssignmentService.deleteTeachingAssignment(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}