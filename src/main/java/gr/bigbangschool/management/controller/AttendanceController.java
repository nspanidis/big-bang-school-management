package gr.bigbangschool.management.controller;

import gr.bigbangschool.management.model.Attendance;
import gr.bigbangschool.management.service.AttendanceService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public List<Attendance> getAllAttendances() {
        return attendanceService.getAllAttendances();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(@PathVariable Long id) {

        return attendanceService.getAttendanceById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/my-children")
    public List<Attendance> getMyChildrenAttendances(
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();

        return attendanceService.getAttendancesForParent(email);
    }

    @PostMapping
    public ResponseEntity<?> createAttendance(
            @RequestBody Attendance attendance) {

        Attendance created =
                attendanceService.createAttendance(attendance);

        if (created == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Υπάρχει ήδη παρουσία για αυτόν τον μαθητή και αυτή την ημερομηνία ή ο μαθητής δεν υπάρχει.");
        }

        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {

        boolean deleted = attendanceService.deleteAttendance(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}