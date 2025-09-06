import { NavLink, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../auth/AuthContext";

export default function Header({ role }) {
    const { user, logout } = useAuth();
    const nav = useNavigate();

    async function onLogout() {
        await logout();
        nav("/login", { replace: true });
    }

    const linkCls = ({ isActive }) =>
        `px-2 py-1 rounded-lg transition ${isActive ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"}`;

    return (
        <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
            <div className="container h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white text-xs font-semibold">SA</span>
                    <span className="font-semibold">School Attendance</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    {role === "admin" && (
                        <>
                            <NavLink to="/admin/students" className={linkCls}>Students</NavLink>
                            <NavLink to="/admin/teachers" className={linkCls}>Teachers</NavLink>
                        </>
                    )}
                    {role === "teacher" && <NavLink to="/teacher/attendance" className={linkCls}>Attendance</NavLink>}
                    <div className="text-neutral-500">Hi, {user?.name}</div>
                    <Button variant="outline" onClick={onLogout}>Logout</Button>
                </div>
            </div>
        </header>
    );
}
