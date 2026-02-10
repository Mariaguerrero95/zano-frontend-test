import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

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
  const [isDark, setIsDark] = useState(false);
  if (isDark) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* sidebar */}
      <Sidebar role={role} />
      {/* main content */}
      <main
        className={role === "admin" ? "admin-view" : "user-view"}
        style={{
          flex: 1,
        }}
      >
        <Outlet />
      </main>
      {/* role switch / mood */}
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
        {/* DAY/NIGHT MODE */}
        <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            onClick={() => setIsDark(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              opacity: isDark ? 0.4 : 1,
            }}
            title="Day mode"
          >
            ☀️
          </button>
          <button
            onClick={() => setIsDark(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              opacity: isDark ? 1 : 0.4,
            }}
            title="Night mode"
          >
            🌙
          </button>
        </div>
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
