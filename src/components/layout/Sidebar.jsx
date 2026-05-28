import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import cyborgMan from "../../assets/cyborg_man.png";

const studentLinks = [
  { to: "/aluno",   icon: "⊞", label: "Dashboard" },
  { to: "/agenda",  icon: "🗓", label: "Agenda" },
  { to: "/produtos",icon: "🛒", label: "Nossa Loja" },
  { to: "/chatbot", icon: <img src={cyborgMan} alt="AlphaBot" style={{ width: "20px", height: "20px", objectFit: "contain" }} />, label: "AlphaBot" },
];

const adminLinks = [
  { to: "/admin",   icon: "⊞", label: "Dashboard" },
  { to: "/aluno",   icon: "◉", label: "Painel Aluno" },
  { to: "/agenda",  icon: "🗓", label: "Agenda" },
  { to: "/produtos",icon: "🛒", label: "Nossa Loja" },
  { to: "/chatbot", icon: <img src={cyborgMan} alt="AlphaBot" style={{ width: "20px", height: "20px", objectFit: "contain" }} />, label: "AlphaBot" },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = user?.role === "admin" ? adminLinks : studentLinks;

  function handleLogout() {
    logout();
    navigate("/");
    if (onClose) onClose();
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Botão de Fechar no Mobile */}
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Fechar menu">
        ✕
      </button>

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
            onClick={onClose}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}

        <Link
          to="/"
          className="sidebar-link"
          style={{ marginTop: "auto" }}
          onClick={onClose}
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
