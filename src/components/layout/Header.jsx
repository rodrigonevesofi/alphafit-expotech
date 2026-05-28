import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import cyborgMan from "../../assets/cyborg_man.png";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo logo-link" onClick={() => setIsMenuOpen(false)}>
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

        {/* Botão Hambúrguer Mobile */}
        <button 
          className={`hamburger-btn ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu Drawer Mobile */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-links">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/produtos" onClick={() => setIsMenuOpen(false)}>Loja</Link>
            <Link to="/chatbot" onClick={() => setIsMenuOpen(false)}>Chatbot</Link>
            <Link to="/agenda" onClick={() => setIsMenuOpen(false)}>Agenda</Link>

            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/aluno"}
                  className="btn-secondary btn-nav"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meu painel
                </Link>
                <button 
                  className="btn-secondary btn-nav" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Sair
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="btn-primary btn-enter"
                onClick={() => setIsMenuOpen(false)}
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
