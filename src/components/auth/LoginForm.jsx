import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiLogin } from "../../services/api";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const data = await apiLogin(email, password);

      if (!data.success) {
        setIsError(true);
        setMessage(data.message || "Erro ao realizar login.");
        return;
      }

      login(data.user, data.token);
      setMessage(data.message);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/aluno");
      }
    } catch {
      setIsError(true);
      setMessage("Não foi possível conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="btn-primary full" type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>

      {message && (
        <p style={{ marginTop: 10, color: isError ? "#ff6b6b" : "#7CFC98", fontWeight: 600 }}>
          {message}
        </p>
      )}
    </form>
  );
}
