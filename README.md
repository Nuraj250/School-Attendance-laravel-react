# School Attendance (Laravel + React)

Simple school attendance system — **Laravel API** + **React SPA** with roles (**Admin / Teacher**), daily attendance, and basic reports.

- **Backend:** `/backend` — Laravel 11 + Sanctum + MySQL
- **Frontend:** `/frontend` — React + Vite + Tailwind
- **Postman:** `/school-attendance.postman_collection.json`

## Features
- Auth: email/password (Sanctum cookies), `me`, logout
- Roles: `admin`, `teacher` (middleware guarded)
- Admin: create/list **Students** & **Teachers**
- Teacher: select **Class** → mark **today’s** Present/Absent (**duplicate per day prevented**)
- Reports: **Student** entries (date/status) + totals

---

## Repo Structure
```

.
├─ backend/                         # Laravel API (README inside)
├─ frontend/                        # React app (README inside)
├─ school-attendance.postman\_collection.json
└─ docs/
└─ screenshots/                  # put your screenshots here

````

---

## Quick Start

### 1) Backend (Laravel)
```bash
cd backend
cp .env.example .env
# Set DB_* and SPA settings:
# APP_URL=http://127.0.0.1:8000
# SESSION_DRIVER=cookie
# SESSION_DOMAIN=localhost
# SANCTUM_STATEFUL_DOMAINS=localhost:5173
# FRONTEND_URL=http://localhost:5173

composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve    # http://127.0.0.1:8000
````

### 2) Frontend (React)

```bash
cd frontend
npm install
echo "VITE_API_BASE_URL=http://127.0.0.1:8000" > .env
npm run dev          # http://localhost:5173
```

### Test Accounts (seeded)

* **Admin:** `admin@school.com` / `password`
* **Teacher:** `teacher@school.com` / `password`

---

## Postman

Import the collection at the repo root:

* **File:** `school-attendance.postman_collection.json`
  Flow: **Auth → Admin (create/list) → Teacher (classes/session/marks) → Reports**.

---

## Screenshots

Place images in `docs/screenshots/` and reference them here.

| View                 | Screenshot                                |
| -------------------- | ----------------------------------------- |
| Login                | `docs/screenshots/login.png`              |
| Admin → Students     | `docs/screenshots/admin-students.png`     |
| Admin → Teachers     | `docs/screenshots/admin-teachers.png`     |
| Teacher → Attendance | `docs/screenshots/teacher-attendance.png` |
| Student Report       | `docs/screenshots/student-report.png`     |

*(Add images to the folder and commit. Optional: embed with markdown once added.)*

---

## Acceptance Checklist

* [x] Login/logout + `me` works (cookies present)
* [x] Role guards (`admin`/`teacher`) enforced
* [x] Admin can **create/list** students & teachers
* [x] Teacher can select class, see students, mark attendance, save
* [x] Duplicate class/day blocked with **409**
* [x] Student report shows entries + totals
* [x] Frontend/Backend READMEs present with run steps
* [x] Postman collection imported and passing

---

## Troubleshooting

* **401/419 after login** → Ensure backend `.env`:

  * `SANCTUM_STATEFUL_DOMAINS=localhost:5173`
  * `SESSION_DOMAIN=localhost`
  * `APP_URL=http://127.0.0.1:8000`
  * Frontend runs at **[http://localhost:5173](http://localhost:5173)** and Axios uses `withCredentials`.
* **CORS** → `FRONTEND_URL=http://localhost:5173` and `config/cors.php` supports credentials.
* **DB issues** → `php artisan migrate:fresh --seed`

---

## Docs

* **Backend README:** [`/backend/README.md`](backend/README.md)
* **Frontend README:** [`/frontend/README.md`](frontend/README.md)

---

## License

MIT (for interview/demo use)
