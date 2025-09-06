import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Card, CardBody } from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("admin@school.com");
    const [password, setPassword] = useState("password");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setErr(""); setLoading(true);
        try {
            const u = await login(email, password);
            nav(u.role === "admin" ? "/admin" : "/teacher/attendance", { replace: true });
        } catch (e) {
            setErr(e?.response?.data?.message || "Login failed");
        } finally { setLoading(false); }
    }

    return (
        <div className="min-h-full grid place-items-center p-6">
            <Card className="w-full max-w-sm">
                <CardBody>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-xl font-semibold">Sign in</h1>
                            <p className="text-sm text-neutral-500">Use the seeded accounts to explore.</p>
                        </div>

                        {err && <div className="text-red-600 text-sm">{err}</div>}

                        <div className="space-y-1">
                            <label className="block text-sm">Email</label>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm">Password</label>
                            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <Button className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>

                        <p className="text-xs text-neutral-500">
                            Try teacher: <code>teacher@school.com</code> / <code>password</code>
                        </p>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
