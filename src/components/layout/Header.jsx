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
        <Link to="/" className="logo logo-link">
          <img src={cyborgMan} alt="Cyborg" className="logo-icon-img" />
          <div>ALPHA<span>FIT</span></div>
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/produtos">Loja</Link>
          <Link to="/chatbot">Chatbot</Link>
          <Link to="/agenda">Agenda</Link>

          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/aluno"}
                className="btn-secondary btn-nav"
              >
                Meu painel
              </Link>
              <button className="btn-secondary btn-nav" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary btn-enter">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
