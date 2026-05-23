export default function SprintBoard() {
  const tasks = [
    { title: "Protótipo no Figma",       status: "Concluído",  done: true },
    { title: "Tela de login e cadastro", status: "Concluído",  done: true },
    { title: "API REST com Node + TS",   status: "Concluído",  done: true },
    { title: "Chatbot com OpenAI API",   status: "Planejado",  done: false },
  ];

  return (
    <div className="glass card">
      <h3>Sprint do projeto</h3>
      <p className="text-soft" style={{ marginBottom: 16 }}>
        Acompanhamento das entregas principais.
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {tasks.map((task) => (
          <div
            key={task.title}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1rem" }}>{task.done ? "✅" : "⏳"}</span>
              <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{task.title}</span>
            </div>
            <span className={task.done ? "badge-success" : "badge-pending"}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
