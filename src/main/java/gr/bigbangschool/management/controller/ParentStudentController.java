package gr.bigbangschool.management.controller;

import gr.bigbangschool.management.model.ParentStudent;
import gr.bigbangschool.management.service.ParentStudentService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/parent-students")
public class ParentStudentController {

    private final ParentStudentService parentStudentService;

    public ParentStudentController(ParentStudentService parentStudentService) {
        this.parentStudentService = parentStudentService;
    }

    @GetMapping
    public List<ParentStudent> getAllParentStudents() {
        return parentStudentService.getAllParentStudents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParentStudent> getParentStudentById(@PathVariable Long id) {

        return parentStudentService.getParentStudentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ParentStudent createParentStudent(@RequestBody ParentStudent parentStudent) {
        return parentStudentService.createParentStudent(parentStudent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParentStudent(@PathVariable Long id) {

        boolean deleted = parentStudentService.deleteParentStudent(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}