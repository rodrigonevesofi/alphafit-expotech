import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({ children, title }) {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">{title || "Dashboard"}</span>
          <div className="topbar-actions">
            <span className="topbar-badge">
              ● Conectado
            </span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>
              {user?.email}
            </span>
          </div>
        </div>
        <div className="page">
          {children}
        </div>
      </div>
    </div>
  );
}
