import React, { createContext, useContext, useEffect, useState } from "react";
import { api, ensureCsrf } from "../api/client";
import { Outlet, Navigate } from "react-router-dom";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [booted, setBooted] = useState(false);

    useEffect(() => {
        api.get("/api/auth/me")
            .then(res => setUser(res.data.user))
            .catch(() => setUser(null))
            .finally(() => setBooted(true));
    }, []);

    async function login(email, password) {
        await ensureCsrf();
        const res = await api.post("/api/auth/login", { email, password });
        setUser(res.data.user);
        return res.data.user;
    }

    async function logout() {
        await api.post("/api/auth/logout");
        setUser(null);
    }

    const value = { user, login, logout, booted };
    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() { return useContext(AuthCtx); }

export function RequireAuth() {
    const { user, booted } = useAuth();
    if (!booted) return <div className="p-6">Loading...</div>;
    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireRole({ role }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/teacher/attendance"} replace />;
    return <Outlet />;
}
