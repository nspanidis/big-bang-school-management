package gr.bigbangschool.management.repository;

import gr.bigbangschool.management.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByClassroomIdInOrClassroomIsNull(
            List<Long> classroomIds
    );
}