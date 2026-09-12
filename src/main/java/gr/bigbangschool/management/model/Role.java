package gr.bigbangschool.management.model;

/**
 * Defines the user roles available in the application.
 *
 * Roles are used by the authentication and authorization system
 * to determine which operations and resources each user
 * is allowed to access.
 */
public enum Role {
    ADMIN,
    TEACHER,
    PARENT
}
