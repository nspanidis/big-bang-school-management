package gr.bigbangschool.management.service;

import gr.bigbangschool.management.model.User;
import gr.bigbangschool.management.repository.UserRepository;
import gr.bigbangschool.management.security.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link AuthService}.
 *
 * Verifies successful authentication as well as login failure
 * for inactive users and invalid passwords.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                passwordEncoder,
                jwtService
        );
    }

    @Test
    void loginShouldReturnTokenWhenCredentialsAreValid() {

        User user = new User();
        user.setEmail("teacher@bigbangschool.gr");
        user.setPassword("encoded-password");
        user.setActive(true);

        when(userRepository.findByEmail(
                "teacher@bigbangschool.gr"
        )).thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "123456",
                "encoded-password"
        )).thenReturn(true);

        when(jwtService.generateToken(user))
                .thenReturn("test-token");

        String token = authService.login(
                "teacher@bigbangschool.gr",
                "123456"
        );

        assertEquals("test-token", token);

        verify(jwtService).generateToken(user);
    }

    @Test
    void loginShouldFailWhenUserIsInactive() {

        User user = new User();
        user.setEmail("teacher@bigbangschool.gr");
        user.setPassword("encoded-password");
        user.setActive(false);

        when(userRepository.findByEmail(
                "teacher@bigbangschool.gr"
        )).thenReturn(Optional.of(user));

        String token = authService.login(
                "teacher@bigbangschool.gr",
                "123456"
        );

        assertNull(token);

        verify(passwordEncoder, never())
                .matches(anyString(), anyString());

        verify(jwtService, never())
                .generateToken(any(User.class));
    }

    @Test
    void loginShouldFailWhenPasswordIsWrong() {

        User user = new User();
        user.setEmail("teacher@bigbangschool.gr");
        user.setPassword("encoded-password");
        user.setActive(true);

        when(userRepository.findByEmail(
                "teacher@bigbangschool.gr"
        )).thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "wrong-password",
                "encoded-password"
        )).thenReturn(false);

        String token = authService.login(
                "teacher@bigbangschool.gr",
                "wrong-password"
        );

        assertNull(token);

        verify(jwtService, never())
                .generateToken(any(User.class));
    }
}