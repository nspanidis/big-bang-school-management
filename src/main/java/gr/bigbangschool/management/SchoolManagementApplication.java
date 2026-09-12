package gr.bigbangschool.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point of the BIG BANG School Management application.
 *
 * Starts the Spring Boot application and initializes
 * the application context and configured components.
 */
@SpringBootApplication
public class SchoolManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(SchoolManagementApplication.class, args);
	}

}
