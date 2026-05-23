import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import cyborgMan from "../../assets/cyborg_man.png";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={cyborgMan} alt="Cyborg" style={{ height: "42px", objectFit: "contain" }} />
          <div>ALPHA<span>FIT</span></div>
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/chatbot">Chatbot</Link>

          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/aluno"}
                className="btn-secondary"
                style={{ padding: "8px 18px", fontSize: "0.85rem" }}
              >
                Meu painel
              </Link>
              <button className="btn-secondary" onClick={handleLogout} style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary" style={{ padding: "10px 22px" }}>
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
