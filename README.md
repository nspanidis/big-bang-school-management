# BIG BANG School Management System

Final Project for Coding Factory, Athens University of Economics and Business (AUEB).

## Description

BIG BANG School Management System is a full-stack web application designed to support basic school management operations.

The application provides different functionality depending on the user's role:

- ADMIN
- TEACHER
- PARENT

Authentication and authorization are implemented using Spring Security and JWT.

## Main Features

### Administrator
- User management
- Student management
- Classroom management
- Enrollment management
- Create, update and delete school data

### Teacher
- View students
- Manage attendance
- Manage announcements
- Access school-related information

### Parent
- View children's attendance
- View children's timetable
- View school announcements

## Technologies

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT Authentication
- REST API
- Maven
- Swagger / OpenAPI

### Frontend
- React
- JavaScript
- Vite
- React Router

### Database
- PostgreSQL 17
- Docker
- Docker Compose

## Architecture

The backend follows a layered architecture:

Controller → Service → Repository → Database

The application also uses a domain model with JPA entities and relationships.

## Security

The application uses:

- JWT authentication
- BCrypt password hashing
- Role-based authorization
- ADMIN, TEACHER and PARENT roles
- Protected REST endpoints

Sensitive configuration values are stored in local configuration files or environment variables and are not committed to the repository.

## API Documentation

After starting the backend, Swagger UI is available at:

http://localhost:8080/swagger-ui/index.html

## Running the Database

Docker Desktop must be running.

From the project root:

```bash
docker compose up -d
```

## Local Configuration

Create the following file:

`src/main/resources/application-local.properties`

Example configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/bigbang_school
spring.datasource.username=YOUR_DATABASE_USERNAME
spring.datasource.password=YOUR_DATABASE_PASSWORD

jwt.secret=YOUR_SECURE_JWT_SECRET
```

Set the active Spring profile to:

```text
SPRING_PROFILES_ACTIVE=local
```

A `.env` file is also used by Docker Compose for the PostgreSQL configuration.

Example:

```env
POSTGRES_DB=bigbang_school
POSTGRES_USER=YOUR_DATABASE_USERNAME
POSTGRES_PASSWORD=YOUR_DATABASE_PASSWORD
```

Sensitive local configuration files are excluded from Git.

## Running the Backend

From the project root on Windows:

```bash
.\mvnw.cmd spring-boot:run
```

The backend will be available at:

```text
http://localhost:8080
```

## Running the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Building the Project

Backend:

```bash
.\mvnw.cmd clean package
```

Frontend:

```bash
cd frontend
npm run build
```

## Testing

Run the backend unit tests with:

```bash
.\mvnw.cmd test
```

The project includes unit tests using JUnit and Mockito.

REST API endpoints can also be tested through Swagger UI or Postman.

## Author

Nikolaos Spanidis

## Academic Project

Developed as the Final Project for the Coding Factory program of the Athens University of Economics and Business (AUEB).