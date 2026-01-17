# HRMS Lite

HRMS Lite is a lightweight Human Resource Management System that allows an admin to manage employee records and track daily attendance through a modern web interface. It is designed as a small but realistic full-stack HR tool with clear separation between frontend and backend. 

---

## Project Overview

The application provides:

- **Employee Management**
  - Create employees with a user-defined unique Employee ID, full name, email and department
  - View a list of all employees
  - Delete employees (with cascade deletion of their attendance records)

- **Attendance Management**
  - Mark attendance for an employee for a specific date
  - Track presence using a boolean flag (`is_present`) and show “Present/Absent” in the UI
  - View attendance records for an employee, with optional date range filtering
  - View an attendance summary showing total present and absent days

The project is split into two folders:

- `/backend` – FastAPI API server with MySQL persistence  
- `/frontend` – React + Vite single-page application that consumes the backend API

---

## Tech Stack

**Backend**

- Python (FastAPI)
- SQLAlchemy (ORM)
- MySQL (relational database)
- Uvicorn (ASGI server)
- Pydantic (data validation)
- Environment variables for DB configuration

**Frontend**

- React (with hooks)
- Vite (bundler/dev server)
- Material UI (MUI) for UI components
- Tailwind CSS for utility styling
- React Router for client-side routing
- Axios for API calls

**Deployment Targets**

- Backend: Railway (Python web service)
- Frontend: Vercel (static frontend hosting)

---

## Steps to Run the Project Locally

### 1. Prerequisites

- **Backend**
  - Python 3.8+ installed
  - MySQL Server running locally
- **Frontend**
  - Node.js 18+ and npm

Make sure MySQL is running and you have credentials for a user that can create and modify the `hrms_lite` database. 

---

### 2. Backend Setup (`/backend`)

1. Open a terminal in the `backend` folder:

    ```bash
    cd backend
    ```

2. Create and activate a virtual environment (Windows example):

    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```

3. Install backend dependencies:

    ```bash
    python -m pip install -r requirements.txt
    ```

4. Create the database in MySQL (from the MySQL client):

    ```sql
    CREATE DATABASE hrms_lite;
    USE hrms_lite;

    CREATE TABLE employees (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    employee_id  VARCHAR(50)    NOT NULL UNIQUE,
    full_name    VARCHAR(100)   NOT NULL,
    email        VARCHAR(150)   NOT NULL UNIQUE,
    department   VARCHAR(100)   NOT NULL
    );

    CREATE TABLE attendance (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    employee_id  VARCHAR(50)    NOT NULL,
    date         DATE           NOT NULL,
    is_present   BOOLEAN        NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_attendance_employee
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
        ON DELETE CASCADE,
    CONSTRAINT uc_employee_date UNIQUE (employee_id, date)
    );
    ```

5. Create a .env file in backend (based on .env.example if present):

    ```text
    DB_USER=root
    DB_PASSWORD=your_password_here
    DB_HOST=localhost
    DB_PORT=3306
    DB_NAME=hrms_lite
    ```

6. Run the backend server:

    ```bash
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    ```

The backend API will be available at http://localhost:8000.

---

### 3. Frontend Setup (/frontend)

1. In a new terminal, go to the frontend folder:

    ```bash
    cd frontend
    ```

2. Install frontend dependencies:

    ```bash
    npm install
    ```

3. Create a .env file in frontend (based on .env.example if present):

    ```text
    VITE_API_BASE_URL=http://localhost:8000
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

By default, the frontend will run at http://localhost:5173 and send API requests to http://localhost:8000.

---

## Assumptions and Limitations

* Single admin user: There is no authentication or authorization; assume a single internal admin uses the tool.

* Simplified HR scope:

    * Only core employee and attendance management is implemented.

    * No leave management, payroll, roles/permissions, or advanced HR workflows.

* Attendance model:

    * Each employee can have at most one attendance record per day (enforced by a unique constraint).

    * Status is stored as a boolean is_present in the database, and mapped to “Present/Absent” only in the UI.

* Validation:

    * Employee ID and email must be unique.

    * Email format is validated on the backend; additional business rules (e.g., department lists) are not enforced.

* Local MySQL:

    * The project expects a working MySQL instance; Docker-based or cloud DB setups are not included in this README.

* SEO:

    * The frontend is a client-side rendered SPA. Basic metadata (title, meta description, Open Graph tags) are provided, but full SSR/SSG SEO optimizations are out of scope.
