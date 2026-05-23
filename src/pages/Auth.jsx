import { useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const { user } = useAuth();
  const [mode, setMode] = useState("login");

  // Redireciona se já estiver logado
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/aluno"} replace />;
  }

  function handleRegisterSuccess() {
    setMode("login");
  }

  return (
    <div className="app-bg">
      <Header />

      <section className="container section auth-layout">
        <div className="glass auth-info">
          <span className="tag">Autenticação</span>
          <h1>
            {mode === "login" ? (
              <>Bem-vindo de <span className="gradient-text">volta</span></>
            ) : (
              <>Crie sua <span className="gradient-text">conta</span></>
            )}
          </h1>
          <p style={{ marginTop: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
            {mode === "login"
              ? "Acesse sua área personalizada com treinos, métricas e acompanhamento de evolução."
              : "Cadastre-se para ter acesso à plataforma e começar sua jornada fitness."}
          </p>

          <div style={{ marginTop: 32 }}>
            <div className="user-info-item" style={{ marginBottom: 12 }}>
              <strong>Conta de teste (admin)</strong>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
                admin@alphafit.com / 123456
              </span>
            </div>
          </div>
        </div>

        <div className="glass auth-box">
          <div className="auth-tabs">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={mode === "cadastro" ? "active" : ""}
              onClick={() => setMode("cadastro")}
            >
              Cadastro
            </button>
          </div>

          {mode === "login"
            ? <LoginForm />
            : <RegisterForm onSuccess={handleRegisterSuccess} />
          }
        </div>
      </section>

      <Footer />
    </div>
  );
}
