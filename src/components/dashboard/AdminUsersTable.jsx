import { useEffect, useState } from "react";
import { apiListUsers, apiCreateUser, apiUpdateUser, apiDeleteUser } from "../../services/api";

const initialForm = { name: "", email: "", phone: "", password: "", role: "student" };

export default function AdminUsersTable() {
  const [users, setUsers]             = useState([]);
  const [error, setError]             = useState("");
  const [message, setMessage]         = useState("");
  const [formData, setFormData]       = useState(initialForm);
  const [editingId, setEditingId]     = useState(null);
  const [deletingId, setDeletingId]   = useState(null); // ID para modal de confirmação

  async function fetchUsers() {
    setError("");
    const data = await apiListUsers();
    if (data.success) setUsers(data.users);
    else setError(data.message || "Erro ao buscar usuários.");
  }

  useEffect(() => { fetchUsers(); }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setMessage(""); setError("");
    setFormData({ name: user.name, email: user.email, phone: user.phone || "", password: "", role: user.role });
  }

  function resetForm() { setEditingId(null); setFormData(initialForm); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setMessage("");

    const payload = editingId
      ? { name: formData.name, email: formData.email, phone: formData.phone, role: formData.role, ...(formData.password ? { password: formData.password } : {}) }
      : formData;

    const data = editingId
      ? await apiUpdateUser(editingId, payload)
      : await apiCreateUser(payload);

    if (!data.success) { setError(data.message || "Erro ao salvar."); return; }
    setMessage(data.message || "Operação realizada com sucesso.");
    resetForm();
    fetchUsers();
  }

  async function confirmDelete() {
    if (!deletingId) return;
    const data = await apiDeleteUser(deletingId);
    setDeletingId(null);
    if (!data.success) { setError(data.message || "Erro ao excluir."); return; }
    setMessage(data.message);
    fetchUsers();
  }

  return (
    <div className="glass card">
      <h3>{editingId ? "✏️ Editar usuário" : "➕ Cadastrar usuário"}</h3>

      {error   && <p style={{ color: "var(--danger)",  marginTop: 10, fontWeight: 600 }}>{error}</p>}
      {message && <p style={{ color: "var(--success)", marginTop: 10, fontWeight: 600 }}>{message}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <input type="text"     name="name"     placeholder="Nome completo" value={formData.name}     onChange={handleChange} required />
        <input type="email"    name="email"    placeholder="E-mail"        value={formData.email}    onChange={handleChange} required />
        <input type="text"     name="phone"    placeholder="Telefone"      value={formData.phone}    onChange={handleChange} />
        <input type="password" name="password" placeholder={editingId ? "Nova senha (opcional)" : "Senha"} value={formData.password} onChange={handleChange} />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student" style={{ color: "#000" }}>Aluno</option>
          <option value="admin"   style={{ color: "#000" }}>Admin</option>
        </select>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-primary" type="submit">
            {editingId ? "Salvar alterações" : "Cadastrar"}
          </button>
          {editingId && (
            <button className="btn-secondary" type="button" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <hr />

      <h3 style={{ marginBottom: 14 }}>Usuários cadastrados</h3>

      <div style={{ display: "grid", gap: 10 }}>
        {users.length === 0 && !error && (
          <p className="text-muted">Carregando...</p>
        )}
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{u.name}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 2 }}>{u.email}</div>
                <div style={{ marginTop: 6 }}>
                  <span className={u.role === "admin" ? "badge-success" : "badge-pending"}>
                    {u.role === "admin" ? "Admin" : "Aluno"}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button className="btn-secondary" style={{ padding: "7px 14px", fontSize: "0.8rem" }} onClick={() => handleEdit(u)}>
                  Editar
                </button>
                <button className="btn-danger" style={{ padding: "7px 14px" }} onClick={() => setDeletingId(u.id)}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmação de exclusão (substitui o window.confirm) */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass card max-w-sm w-full text-center">
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⚠️</div>
            <h3 style={{ marginBottom: "8px" }}>Confirmar exclusão</h3>
            <p className="text-soft" style={{ marginBottom: "24px" }}>
              Deseja realmente excluir este usuário? Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-secondary flex-1" onClick={() => setDeletingId(null)}>
                Cancelar
              </button>
              <button className="btn-danger flex-1" onClick={confirmDelete}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
