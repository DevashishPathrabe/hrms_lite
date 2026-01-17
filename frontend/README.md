# HRMS Lite – Frontend (React + Vite)

This folder contains the frontend for HRMS Lite, a React single-page application that provides a modern UI for managing employees and tracking attendance.

---

## Tech Stack

- **React** with hooks
- **Vite** for development and build
- **Material UI (MUI)** for components and layout
- **Tailwind CSS** for utility-first styling
- **React Router** for navigation
- **Axios** for HTTP requests
- **Deployed target (planned)**: Vercel

---

## Features

- **Dashboard**
  - Total employees
  - Total attendance records
  - Present and absent counts for today

- **Employee Management**
  - View employees in a responsive table
  - Add employees with:
    - Employee ID (user-entered, required, unique)
    - Full name
    - Email
    - Department
  - Delete employees (with confirmation)

- **Attendance Management**
  - View attendance records with filters:
    - By employee
    - By date
  - Mark attendance for a given date:
    - `is_present` boolean mapped to “Present/Absent” in the UI

- **Employee Attendance View**
  - Show detailed attendance for a single employee
  - Filter by date range
  - Summary of total present and absent days

- **UI/UX**
  - Responsive layout (desktop, tablet, mobile)
  - Beige-themed color palette using custom MUI theme
  - Loading spinners and error states for API calls

---

## Steps to Run the Frontend Locally

### 1. Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000` (or configure via `.env`)

### 2. Install Dependencies

From the `frontend` directory:

```bash
cd frontend
npm install
```

### 3. Configure API Base URL  

Create a .env file in the frontend directory (based on .env.example if present):

```text
VITE_API_BASE_URL=http://localhost:8000
```

This URL should point to your running backend. Vite injects import.meta.env.VITE_API_BASE_URL at build time.

### 4. Running the Application

#### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).
The frontend will call the backend API at VITE_API_BASE_URL.

#### Production Build

```bash
npm run build
```

The built files will be in the `dist` directory.

#### Preview Production Build

```bash
npm run preview
```

---

## Assumptions and Limitations
* Client-side rendering (CSR):

   * The app is a SPA rendered in the browser.

   * Basic SEO improvements (title, meta description, Open Graph tags) are provided, but full SSR/SSG is not implemented.

* No authentication UI:

   * All screens are accessible without login; this matches the backend assumption of a single admin user.

* Input validation:

   * Basic form validation is done on the client (required fields, email type).

   * Uniqueness and deeper validation are handled by the backend (e.g., duplicate Employee ID, duplicate attendance per day).

* Fixed routing structure:

   * Routes are defined in App.jsx and assumed to be served from / (no nested base path configuration).