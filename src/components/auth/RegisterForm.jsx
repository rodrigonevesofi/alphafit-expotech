import { useState } from "react";
import { apiRegister } from "../../services/api";

export default function RegisterForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRegister(name, email, phone, password);

      if (!data.success) {
        setIsError(true);
        setMessage(data.message || "Erro ao cadastrar.");
        return;
      }

      setMessage(data.message || "Cadastro realizado com sucesso!");
      setName(""); setEmail(""); setPhone(""); setPassword(""); setConfirmPassword("");
      if (onSuccess) onSuccess();
    } catch {
      setIsError(true);
      setMessage("Não foi possível conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Telefone (opcional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirmar senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button className="btn-primary full" type="submit" disabled={loading}>
        {loading ? "Cadastrando..." : "Criar conta"}
      </button>

      {message && (
        <p style={{ marginTop: 10, color: isError ? "#ff6b6b" : "#7CFC98", fontWeight: 600 }}>
          {message}
        </p>
      )}
    </form>
  );
}
