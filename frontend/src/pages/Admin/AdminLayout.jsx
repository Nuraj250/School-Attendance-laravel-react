import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

export default function AdminLayout() {
    return (
        <div className="min-h-full">
            <Header role="admin" />
            <main className="container py-6 space-y-6">
                <Outlet />
            </main>
        </div>
    );
}
