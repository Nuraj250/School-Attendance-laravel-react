# School Attendance — Frontend (React + Vite + Tailwind)

Modern, minimal React SPA for the School Attendance interview project.  
Works with the Laravel API backend (Sanctum cookie auth, Admin/Teacher roles).

## Features
- **Auth:** Email/password sign-in; session persisted via Sanctum cookies; auto “whoami” on refresh.
- **Role-based routing:** `admin` → Admin area; `teacher` → Attendance.
- **Admin:** Create/List Students & Teachers; filter students by class.
- **Teacher:** Select class → fetch students → mark Present/Absent for **today** → Save.
- **Duplicate protection:** UI surfaces **409** from backend if a class is already marked today.
- **Reports:** Student report page (entries + totals).
- **Modern UI:** Cards, Buttons, Inputs, Selects, Banners, Sticky Header (clean, rounded, subtle shadows).

---

## Tech Stack
- **React 18** + **Vite**
- **React Router**
- **Axios** (with `withCredentials` enabled)
- **TailwindCSS**
- Works against backend: **Laravel 11 + Sanctum + MySQL**

---

## Requirements
- Node.js 18+
- Backend running at `http://127.0.0.1:8000` (or your host)
- Backend must be configured for Sanctum SPA:
  - `.env` on backend:
    ```
    APP_URL=http://127.0.0.1:8000
    SESSION_DRIVER=cookie
    SESSION_DOMAIN=localhost
    SANCTUM_STATEFUL_DOMAINS=localhost:5173
    FRONTEND_URL=http://localhost:5173
    ```
  - `config/cors.php` allows the frontend origin and `supports_credentials => true`.

---

## Quick Start

```bash
cd frontend
npm install

# Set the API base (defaults shown)
echo "VITE_API_BASE_URL=http://127.0.0.1:8000" > .env

# Dev server
npm run dev
# → http://localhost:5173
````

**Seeded test accounts (from backend seeders):**

* Admin: `admin@school.com` / `password`
* Teacher: `teacher@school.com` / `password`

---

## Scripts

* `npm run dev` — start Vite dev server
* `npm run build` — production build to `dist/`
* `npm run preview` — preview the production build locally

---

## Environment

* `VITE_API_BASE_URL` — base URL of the Laravel backend (e.g., `http://127.0.0.1:8000`)

Axios is configured with `withCredentials: true` so Sanctum cookies flow between front and back ends.

---

## Project Structure

```
frontend/
├─ src/
│  ├─ api/
│  │  └─ client.js            # axios instance + ensureCsrf()
│  ├─ auth/
│  │  └─ AuthContext.jsx       # login(), logout(), me(); RequireAuth/RequireRole
│  ├─ components/
│  │  ├─ Header.jsx
│  │  └─ ui/
│  │     ├─ Banner.jsx
│  │     ├─ Button.jsx
│  │     ├─ Card.jsx
│  │     ├─ Input.jsx
│  │     └─ Select.jsx
│  ├─ pages/
│  │  ├─ Login.jsx
│  │  ├─ Admin/
│  │  │  ├─ AdminLayout.jsx
│  │  │  ├─ StudentsPage.jsx
│  │  │  └─ TeachersPage.jsx
│  │  ├─ Teacher/
│  │  │  └─ AttendancePage.jsx
│  │  └─ Reports/
│  │     └─ StudentReportPage.jsx
│  ├─ router.jsx
│  ├─ main.jsx
│  └─ index.css
├─ .env
├─ index.html
└─ package.json
```

---

## Routing

* `/login` — sign in
* `/admin` — admin layout

  * `/admin/students` — create/list students (+ filter)
  * `/admin/teachers` — create/list teachers
* `/teacher/attendance` — take attendance for today
* `/reports/student/:id` — student attendance report

Guards:

* `RequireAuth` protects private routes.
* `RequireRole` gates admin/teacher routes based on `user.role`.

---

## API Usage (Frontend → Backend)

> Endpoints are provided by the Laravel API (see backend README).

* **Auth**

  * `POST /api/auth/login` — sign in (Sanctum cookie created)
  * `GET /api/auth/me` — current session user
  * `POST /api/auth/logout` — sign out
* **Admin**

  * `POST /api/students` · `GET /api/students?class_name=...`
  * `POST /api/teachers` · `GET /api/teachers`
* **Teacher**

  * `GET /api/classes` — distinct classes
  * `GET /api/students/by-class?class_name=...` — students for class
  * `POST /api/attendance/sessions` — create today’s session (409 on duplicate)
  * `POST /api/attendance/sessions/{id}/marks` — save marks
* **Reports**

  * `GET /api/students/{id}/attendance?from=&to=`

---

## UX Notes

* Default status is **Present**. You can quickly mark only absences; the UI computes totals.
* If a session already exists for the selected class today, backend returns **409**; the page shows a warning banner.
* Modern look: rounded cards, subtle shadows, focus rings, sticky header.

---

## Common Pitfalls / Troubleshooting

* **401 after login or 419 CSRF**

  * Ensure backend `.env` has `SANCTUM_STATEFUL_DOMAINS=localhost:5173` and `SESSION_DOMAIN=localhost`.
  * Frontend must run on **[http://localhost:5173](http://localhost:5173)** (not 127.0.0.1) to match the stateful domain.
  * Axios must send credentials (already enabled in `api/client.js`).
* **CORS error**

  * Confirm backend `FRONTEND_URL=http://localhost:5173` and `config/cors.php` allows it with `supports_credentials => true`.
* **Using a different port/host**

  * Update `VITE_API_BASE_URL` accordingly, and keep stateful domain in backend aligned with your frontend origin.

---

## Production Build / Deployment

```
npm run build
npm run preview  # optional local preview at http://localhost:4173
```

Host the static `dist/` on any static host (Netlify, Vercel, S3+CloudFront, etc.) with the backend reachable over HTTPS and CORS/Sanctum configured to match your deployed origin.

---

## License

MIT (for interview/demo use)