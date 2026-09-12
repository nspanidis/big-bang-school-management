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

Sensitive configuration values are provided through environment variables and are not committed to the repository.

## API Documentation

After starting the backend, Swagger UI is available at:

http://localhost:8080/swagger-ui/index.html

## Running the Database

Docker Desktop must be running.

From the project root:

```bash
docker compose up -d