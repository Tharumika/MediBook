# MediBook - Patient Appointment Management System

A full-stack healthcare web application built with **Java Spring Boot** and **Angular**, simulating a real-world clinic appointment system. Developed as a portfolio project targeting healthcare software engineering.

## Live Demo & Deployment

The application is deployed live across cloud platforms:
* **Frontend Portal (Netlify):** [https://medibook-portal.netlify.app](https://medibook-portal.netlify.app)
* **Doctor Registration Portal:** [https://medibook-portal.netlify.app/doctor-register](https://medibook-portal.netlify.app/doctor-register)
* **Backend API (Railway):** `https://<your-backend-subdomain>.up.railway.app`

## Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Backend    | Java 17, Spring Boot 3, Spring Data JPA, Spring Security |
| Frontend   | Angular 17, TypeScript, Angular Material                |
| Database   | MySQL (H2 in-memory for dev/testing)                   |
| Auth       | JWT (JSON Web Tokens)                                   |
| API        | RESTful, documented via Postman                         |
| Build      | Maven (backend), Angular CLI (frontend)                 |

## Features

- **Patient** - register, login, book / cancel / reschedule appointments
- **Doctor** - view schedule, manage appointment status
- **Admin** - manage doctors, patients, and appointment records
- **JWT Auth** - role-based access control (PATIENT, DOCTOR, ADMIN)
- **Reactive Forms** - Angular forms with full client-side validation
- **REST API** - clean endpoints following REST conventions

## Project Structure

```
medibook/
├── backend/                        # Spring Boot application
│   └── src/main/java/com/medibook/
│       ├── auth/                   # JWT config & security
│       ├── user/                   # User entity & roles
│       ├── doctor/                 # Doctor management
│       ├── patient/                # Patient management
│       └── appointment/            # Booking logic
├── frontend/                       # Angular application
│   └── src/app/
│       ├── auth/                   # Login & register pages
│       ├── dashboard/              # Role-based dashboards
│       ├── appointments/           # Booking components
│       └── shared/                 # Interceptors, guards, models
└── docs/
    └── MediBook.postman_collection.json
```

## Getting Started

### Backend
```bash
cd backend
# Configure DB in src/main/resources/application.properties
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
ng serve
# Runs on http://localhost:4200
```

### Default Test Accounts
| Role    | Email                   | Password    |
|---------|-------------------------|-------------|
| Admin   | admin@medibook.com      | Admin@123   |
| Doctor  | doctor@medibook.com     | Doctor@123  |
| Patient | patient@medibook.com    | Patient@123 |

## API Endpoints

| Method | Endpoint                         | Description           | Auth    |
|--------|----------------------------------|-----------------------|---------|
| POST   | `/api/auth/register`             | Register new patient  | Public  |
| POST   | `/api/auth/login`                | Login, receive JWT    | Public  |
| GET    | `/api/doctors`                   | List all doctors      | Public  |
| POST   | `/api/appointments`              | Book appointment      | PATIENT |
| GET    | `/api/appointments/my`           | View my appointments  | PATIENT |
| PATCH  | `/api/appointments/{id}/cancel`  | Cancel appointment    | PATIENT |
| GET    | `/api/doctor/schedule`           | Doctor's appointments | DOCTOR  |
| GET    | `/api/admin/dashboard`           | Admin overview        | ADMIN   |

## Author

**Vidun Tharumika** - [vidun.me](https://vidun.me) · [LinkedIn](https://www.linkedin.com/in/vidun-tharumika) · [GitHub](https://github.com/Tharumika)
