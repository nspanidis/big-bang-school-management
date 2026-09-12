package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.Announcement;
import gr.bigbangschool.management.model.Classroom;
import gr.bigbangschool.management.model.Enrollment;
import gr.bigbangschool.management.model.Parent;
import gr.bigbangschool.management.model.ParentStudent;
import gr.bigbangschool.management.model.User;

import gr.bigbangschool.management.repository.AnnouncementRepository;
import gr.bigbangschool.management.repository.ClassroomRepository;
import gr.bigbangschool.management.repository.EnrollmentRepository;
import gr.bigbangschool.management.repository.ParentRepository;
import gr.bigbangschool.management.repository.ParentStudentRepository;
import gr.bigbangschool.management.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;
    private final ClassroomRepository classroomRepository;
    private final ParentRepository parentRepository;
    private final ParentStudentRepository parentStudentRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AnnouncementService(
            AnnouncementRepository announcementRepository,
            UserRepository userRepository,
            ClassroomRepository classroomRepository,
            ParentRepository parentRepository,
            ParentStudentRepository parentStudentRepository,
            EnrollmentRepository enrollmentRepository) {

        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
        this.classroomRepository = classroomRepository;
        this.parentRepository = parentRepository;
        this.parentStudentRepository = parentStudentRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }

    public List<Announcement> getAnnouncementsForParent(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return List.of();
        }

        Parent parent =
                parentRepository.findByUserId(user.getId()).orElse(null);

        if (parent == null) {
            return List.of();
        }

        List<ParentStudent> parentStudents =
                parentStudentRepository.findByParentId(parent.getId());

        List<Long> classroomIds = parentStudents.stream()
                .flatMap(parentStudent ->
                        enrollmentRepository
                                .findByStudentIdAndActiveTrue(
                                        parentStudent.getStudent().getId()
                                )
                                .stream()
                )
                .map(Enrollment::getClassroom)
                .map(Classroom::getId)
                .distinct()
                .toList();

        return announcementRepository
                .findByClassroomIdInOrClassroomIsNull(classroomIds);
    }

    public Announcement createAnnouncement(
            Announcement announcement,
            String creatorEmail) {

        User creator =
                userRepository.findByEmail(creatorEmail).orElse(null);

        if (creator == null) {
            return null;
        }

        announcement.setCreatedBy(creator);

        if (announcement.getClassroom() != null) {

            Long classroomId =
                    announcement.getClassroom().getId();

            Classroom classroom =
                    classroomRepository
                            .findById(classroomId)
                            .orElse(null);

            if (classroom == null) {
                return null;
            }

            announcement.setClassroom(classroom);
        }

        return announcementRepository.save(announcement);
    }

    public Announcement updateAnnouncement(
            Long id,
            Announcement updatedAnnouncement) {

        Announcement existingAnnouncement =
                announcementRepository.findById(id).orElse(null);

        if (existingAnnouncement == null) {
            return null;
        }

        existingAnnouncement.setTitle(
                updatedAnnouncement.getTitle()
        );

        existingAnnouncement.setContent(
                updatedAnnouncement.getContent()
        );

        if (updatedAnnouncement.getClassroom() == null) {

            existingAnnouncement.setClassroom(null);

        } else {

            Long classroomId =
                    updatedAnnouncement.getClassroom().getId();

            Classroom classroom =
                    classroomRepository
                            .findById(classroomId)
                            .orElse(null);

            if (classroom == null) {
                return null;
            }

            existingAnnouncement.setClassroom(classroom);
        }

        return announcementRepository.save(existingAnnouncement);
    }

    public boolean deleteAnnouncement(Long id) {

        if (!announcementRepository.existsById(id)) {
            return false;
        }

        announcementRepository.deleteById(id);

        return true;
    }
}