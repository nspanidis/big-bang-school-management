package gr.bigbangschool.management.repository;

import gr.bigbangschool.management.model.ParentStudent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParentStudentRepository extends JpaRepository<ParentStudent, Long> {

    List<ParentStudent> findByParentId(Long parentId);
}