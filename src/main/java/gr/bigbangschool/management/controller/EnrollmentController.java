package gr.bigbangschool.management.controller;

import gr.bigbangschool.management.model.Enrollment;
import gr.bigbangschool.management.service.EnrollmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(
            EnrollmentService enrollmentService) {

        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enrollment> getEnrollmentById(
            @PathVariable Long id) {

        return enrollmentService.getEnrollmentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    @PostMapping
    public ResponseEntity<?> createEnrollment(
            @RequestBody Enrollment enrollment) {

        Enrollment createdEnrollment =
                enrollmentService.createEnrollment(enrollment);

        if (createdEnrollment == null) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "Ο μαθητής έχει ήδη ενεργή εγγραφή σε αυτή την τάξη ή τα στοιχεία μαθητή/τάξης δεν είναι έγκυρα."
                    );
        }

        return ResponseEntity.ok(createdEnrollment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnrollment(
            @PathVariable Long id,
            @RequestBody Enrollment enrollment) {

        if (enrollmentService.getEnrollmentById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Enrollment updatedEnrollment =
                enrollmentService.updateEnrollment(
                        id,
                        enrollment
                );

        if (updatedEnrollment == null) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "Δεν μπορεί να δημιουργηθεί δεύτερη ενεργή εγγραφή του ίδιου μαθητή στην ίδια τάξη ή τα στοιχεία δεν είναι έγκυρα."
                    );
        }

        return ResponseEntity.ok(updatedEnrollment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(
            @PathVariable Long id) {

        boolean deleted =
                enrollmentService.deleteEnrollment(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}