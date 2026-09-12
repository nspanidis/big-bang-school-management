package gr.bigbangschool.management.controller;

import gr.bigbangschool.management.model.TeacherClassroom;
import gr.bigbangschool.management.service.TeacherClassroomService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-classrooms")
public class TeacherClassroomController {

    private final TeacherClassroomService teacherClassroomService;

    public TeacherClassroomController(TeacherClassroomService teacherClassroomService) {
        this.teacherClassroomService = teacherClassroomService;
    }

    @GetMapping
    public List<TeacherClassroom> getAllTeacherClassrooms() {
        return teacherClassroomService.getAllTeacherClassrooms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherClassroom> getTeacherClassroomById(@PathVariable Long id) {

        return teacherClassroomService.getTeacherClassroomById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public TeacherClassroom createTeacherClassroom(@RequestBody TeacherClassroom teacherClassroom) {
        return teacherClassroomService.createTeacherClassroom(teacherClassroom);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacherClassroom(@PathVariable Long id) {

        boolean deleted = teacherClassroomService.deleteTeacherClassroom(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}