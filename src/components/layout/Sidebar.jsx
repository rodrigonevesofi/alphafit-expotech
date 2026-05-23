import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import cyborgMan from "../../assets/cyborg_man.png";

const studentLinks = [
  { to: "/aluno",   icon: "⊞", label: "Dashboard" },
  { to: "/chatbot", icon: <img src={cyborgMan} alt="AlphaBot" style={{ width: "20px", height: "20px", objectFit: "contain" }} />, label: "AlphaBot" },
];

const adminLinks = [
  { to: "/admin",   icon: "⊞", label: "Dashboard" },
  { to: "/aluno",   icon: "◉", label: "Painel Aluno" },
  { to: "/chatbot", icon: <img src={cyborgMan} alt="AlphaBot" style={{ width: "20px", height: "20px", objectFit: "contain" }} />, label: "AlphaBot" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = user?.role === "admin" ? adminLinks : studentLinks;

  function handleLogout() {
    logout();
    navigate("/");
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={cyborgMan} alt="Cyborg" style={{ height: "42px", objectFit: "contain" }} />
        <div className="sidebar-logo-text">
          ALPHA<span>FIT</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${location.pathname === link.to ? "active" : ""}`}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}

        <Link
          to="/"
          className="sidebar-link"
          style={{ marginTop: "auto" }}
        >
          <span className="sidebar-link-icon">⌂</span>
          Página inicial
        </Link>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || "Usuário"}</div>
            <div className="sidebar-user-role">{user?.role === "admin" ? "Admin" : "Aluno"}</div>
          </div>
          <button
            className="sidebar-logout"
            onClick={handleLogout}
            title="Sair"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
