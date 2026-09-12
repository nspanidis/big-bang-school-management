package gr.bigbangschool.management.service;

import gr.bigbangschool.management.repository.UserRepository;
import gr.bigbangschool.management.security.JwtService;
import gr.bigbangschool.management.model.User;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Handles user authentication for the application.
 *
 * Validates user credentials, checks whether the account is active
 * and generates a JWT token for successfully authenticated users.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return null;
        }

        if (!user.isActive()) {
            return null;
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }

        return jwtService.generateToken(user);
    }
}