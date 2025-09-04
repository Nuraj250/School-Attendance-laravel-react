# School Attendance — Backend (Laravel API)

Laravel 11 API for a simple school attendance system. Provides auth (Sanctum), Admin & Teacher roles, CRUD for students/teachers, daily attendance sessions (one per class per day), and a basic student attendance report.

## Tech
- PHP 8.2+, Laravel 11
- Sanctum (SPA cookie auth)
- MySQL 8+ (or MariaDB 10.6+)
- Composer 2.x

## Features
- **Auth:** email/password login, logout, `me` (current user).
- **Roles:** `admin`, `teacher` (middleware-guarded).
- **Admin:** create/list Teachers & Students.
- **Teacher:** select class, create attendance session for **today** (duplicate protected), submit marks.
- **Reports:** student attendance list and summary (present/absent totals).

---

## Quick Start

```bash
# 1) Install deps
composer install

# 2) Configure env
cp .env.example .env
# Open .env and set DB_*, APP_URL, SANCTUM, etc. (see below)

# 3) App key
php artisan key:generate

# 4) Migrate + seed users & sample students
php artisan migrate --seed

# 5) Serve API (http://127.0.0.1:8000)
php artisan serve
````

### Required .env keys (example)

```dotenv
APP_NAME="School Attendance API"
APP_ENV=local
APP_URL=http://127.0.0.1:8000

# Session & Sanctum (for SPA at http://localhost:5173)
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=attendance
DB_USERNAME=root
DB_PASSWORD=yourpassword

# CORS (config/cors.php uses FRONTEND_URL)
```

### CORS

`config/cors.php` allows the frontend origin (`FRONTEND_URL`) and credentials (cookies). No extra setup if you used the provided file.

---

## Seeded Test Accounts

* **Admin:** `admin@school.com` / `password`
* **Teacher:** `teacher@school.com` / `password`

Run via: `php artisan migrate --seed`

---

## API Endpoints

> All routes are prefixed with `/api`. Authenticated routes use Sanctum cookies (`withCredentials` from the SPA).

### Auth

* `POST /api/auth/login` — body: `{ "email": "...", "password": "..." }` → `200 { user }`
* `POST /api/auth/logout` → `204`
* `GET  /api/auth/me` → `200 { user }`

### Admin (requires `role:admin`)

* `POST /api/teachers` — create teacher
  Body: `{ "name": "T Name", "email": "t@x.com", "password": "secret" }`
* `GET  /api/teachers` — list teachers
* `POST /api/students` — create student
  Body: `{ "name": "S Name", "class_name": "Grade 5" }`
* `GET  /api/students?class_name=Grade%205` — list (optionally filter by class)

### Teacher (requires `role:teacher`)

* `GET  /api/classes` — distinct class names from students
* `POST /api/attendance/sessions` — create today’s session
  Body: `{ "class_name": "Grade 5", "date": "YYYY-MM-DD" (optional) }`
  Responses: `201` on create, **`409` if already created for class+date**
* `POST /api/attendance/sessions/{id}/marks` — save marks
  Body: `{ "marks": [ { "student_id": 1, "status": "present|absent" }, ... ] }`

### Reports (any authenticated user)

* `GET /api/students/{id}/attendance?from=YYYY-MM-DD&to=YYYY-MM-DD`
  → `{ student, range, summary: { total, present, absent }, entries: [...] }`

---

## Smoke Test (cURL)

```bash
# Login (admin)
curl -i -X POST -c cookies.txt -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"password"}' \
  http://127.0.0.1:8000/api/auth/login

# Create a student (admin)
curl -i -X POST -c cookies.txt -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"name":"Aarav Kumar","class_name":"Grade 5"}' \
  http://127.0.0.1:8000/api/students

# Logout
curl -i -X POST -c cookies.txt -b cookies.txt http://127.0.0.1:8000/api/auth/logout
```

---

## Project Structure (backend)

```
backend/
├─ app/
│  ├─ Http/
│  │  ├─ Controllers/ (AuthController, AdminController, AttendanceController, ReportController)
│  │  └─ Middleware/ (RoleMiddleware)
│  └─ Models/ (User, Student, AttendanceSession, Attendance)
├─ database/
│  ├─ migrations/ (users role, students, attendance_sessions, attendances)
│  └─ seeders/ (UsersSeeder, StudentsSeeder)
├─ routes/
│  └─ api.php
└─ .env, composer.json, ...
```

---

## Troubleshooting

* **419 / CSRF or 401 after login**
  Ensure the SPA uses `withCredentials: true`, and `.env` has:

  * `SANCTUM_STATEFUL_DOMAINS=localhost:5173`
  * `SESSION_DOMAIN=localhost`
  * `APP_URL=http://127.0.0.1:8000`

* **CORS errors**
  Verify `FRONTEND_URL=http://localhost:5173` and `config/cors.php` has `supports_credentials => true`.

* **SQL / Migrations**
  Check DB connectivity; run `php artisan migrate:fresh --seed` during dev.

---

## License

MIT (for interview/demo use)
