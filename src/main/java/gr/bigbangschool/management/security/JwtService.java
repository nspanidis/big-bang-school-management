package gr.bigbangschool.management.security;

import gr.bigbangschool.management.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Provides JWT token generation and validation functionality.
 *
 * The service creates signed authentication tokens containing
 * user identity and role information and validates incoming tokens
 * used to access protected application resources.
 */
@Service
public class JwtService {

    private final SecretKey key;

    public JwtService(
            @Value("${jwt.secret}") String secretKey) {

        this.key = Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }

    /**
     * Generates a signed JWT token for an authenticated user.
     *
     * @param user the authenticated user
     * @return the generated JWT token
     */
    public String generateToken(User user) {

        long expirationTime = 1000L * 60 * 60 * 24;

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().name())
                .claim("userId", user.getId())
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis() + expirationTime
                        )
                )
                .signWith(key)
                .compact();
    }

    /**
     * Extracts the user's email address from a JWT token.
     *
     * @param token the JWT token
     * @return the email stored in the token subject
     */
    public String extractEmail(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    /**
     * Validates that a JWT token belongs to the expected user.
     *
     * @param token the JWT token to validate
     * @param email the expected user email
     * @return true when the token is valid for the given email
     */
    public boolean isTokenValid(
            String token,
            String email) {

        String extractedEmail =
                extractEmail(token);

        return extractedEmail.equals(email);
    }
}