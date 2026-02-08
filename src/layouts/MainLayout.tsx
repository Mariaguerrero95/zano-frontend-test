import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import WelcomeModal from "../components/WelcomeModal";

type MainLayoutProps = {
  role: "user" | "admin";
  onRoleChange: (role: "user" | "admin") => void;
};
function MainLayout({ role, onRoleChange }: MainLayoutProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sidebar role={role} />
      <WelcomeModal role={role} />
      {/* MAIN CONTENT */}
      <main
        className={role === "admin" ? "admin-view" : "user-view"}
        style={{
          flex: 1,
          padding: "32px",  
        }}
      >
        <Outlet />
      </main>
      {/* ROLE SWITCH */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          padding: "8px 12px",
          borderRadius: 8,
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          zIndex: 1000,
        }}
      >
        <label style={{ marginRight: 8, fontWeight: 500 }}>
          Role:
        </label>
        <select
          value={role}
          onChange={(e) =>
            onRoleChange(e.target.value as "user" | "admin")
          }
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  );
}

export default MainLayout;
