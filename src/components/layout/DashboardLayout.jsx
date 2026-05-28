import { useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({ children, title }) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className="main-content">
        <div className="topbar">
          <button 
            className="sidebar-toggle" 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            ☰
          </button>
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
