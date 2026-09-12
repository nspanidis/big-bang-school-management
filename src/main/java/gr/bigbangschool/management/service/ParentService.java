package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.Parent;
import gr.bigbangschool.management.repository.ParentRepository;
import org.springframework.stereotype.Service;
import gr.bigbangschool.management.model.User;
import gr.bigbangschool.management.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ParentService {

    private final ParentRepository parentRepository;

    private final UserRepository userRepository;

    public ParentService(ParentRepository parentRepository,
                         UserRepository userRepository) {
        this.parentRepository = parentRepository;
        this.userRepository = userRepository;
    }

    public List<Parent> getAllParents() {
        return parentRepository.findAll();
    }

    public Optional<Parent> getParentById(Long id) {
        return parentRepository.findById(id);
    }

    public Parent createParent(Parent parent) {

        Long userId = parent.getUser().getId();

        User existingUser = userRepository.findById(userId).orElse(null);

        if (existingUser == null) {
            return null;
        }

        parent.setUser(existingUser);

        return parentRepository.save(parent);
    }

    public boolean deleteParent(Long id) {

        if (!parentRepository.existsById(id)) {
            return false;
        }

        parentRepository.deleteById(id);
        return true;
    }

    public Parent updateParent(Long id, Parent updatedParent) {

        Parent existingParent = parentRepository.findById(id).orElse(null);

        if (existingParent == null) {
            return null;
        }

        Long userId = updatedParent.getUser().getId();

        User existingUser = userRepository.findById(userId).orElse(null);

        if (existingUser == null) {
            return null;
        }

        existingParent.setUser(existingUser);
        existingParent.setPhone(updatedParent.getPhone());
        existingParent.setAddress(updatedParent.getAddress());

        return parentRepository.save(existingParent);
    }
}
