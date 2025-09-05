import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { useAuth, RequireAuth, RequireRole } from "./auth/AuthContext";
import AdminLayout from "./pages/Admin/AdminLayout";
import StudentsPage from "./pages/Admin/StudentsPage";
import TeachersPage from "./pages/Admin/TeachersPage";
import AttendancePage from "./pages/Teacher/AttendancePage";
import StudentReportPage from "./pages/Reports/StudentReportPage";

export function AppRouter() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/teacher/attendance"} replace /> : <Login />} />

            <Route element={<RequireAuth />}>
                <Route path="/reports/student/:id" element={<StudentReportPage />} />

                {/* Admin */}
                <Route element={<RequireRole role="admin" />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<StudentsPage />} />
                        <Route path="students" element={<StudentsPage />} />
                        <Route path="teachers" element={<TeachersPage />} />
                    </Route>
                </Route>

                {/* Teacher */}
                <Route element={<RequireRole role="teacher" />}>
                    <Route path="/teacher/attendance" element={<AttendancePage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to={user ? (user.role === "admin" ? "/admin" : "/teacher/attendance") : "/login"} replace />} />
        </Routes>
    );
}
