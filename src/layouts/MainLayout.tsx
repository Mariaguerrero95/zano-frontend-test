import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

type MainLayoutProps = {
    role: "user" | "admin";
    onRoleChange: (role: "user" | "admin") => void;
};

function MainLayout({ role, onRoleChange }: MainLayoutProps) {
    return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
    <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
    </main>
    <div
        style={{
            position: "fixed",
            top: 8,
            right: 16,
            zIndex: 1000,
        }}>
        <label style={{ marginRight: 8 }}>Role:</label>
        <select
            value={role}
            onChange={(e) =>
                onRoleChange(e.target.value as "user" | "admin")
            }>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        </select>
    </div>
    </div>
    );
}

export default MainLayout;
