import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

type MoodLevel =
  | "very_bad"
  | "bad"
  | "neutral"
  | "good"
  | "very_good"
  | null;

type MainLayoutProps = {
  role: "user" | "admin";
  onRoleChange: (role: "user" | "admin") => void;
  flyingMood: MoodLevel;
};

function MainLayout({ role, onRoleChange, flyingMood }: MainLayoutProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sidebar role={role} />

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

      {/* ROLE SWITCH + MOOD */}
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
          textAlign: "center",
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

        {role === "user" && flyingMood && (
          <div
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#374151",
              animation: "moodFlyIn 1.8s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <span className="mood-fly-emoji">
              {{
                very_bad: "😡",
                bad: "😕",
                neutral: "😐",
                good: "🙂",
                very_good: "😄",
              }[flyingMood]}
            </span>
            <span>Feedback sent</span>
          </div>
        )}

      </div>
    </div>
  );
}

export default MainLayout;
