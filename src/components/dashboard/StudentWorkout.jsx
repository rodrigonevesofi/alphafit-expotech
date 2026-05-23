export default function StudentWorkout({ dashboard, onCheckIn, checkLoading }) {
  const workoutSheet = dashboard?.workoutSheet;
  const items = workoutSheet?.items || [];

  return (
    <div className="glass card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <h3>Ficha da semana</h3>

        <span
          className="badge-pending"
          style={{
            background: "rgba(255,107,0,0.12)",
            color: "var(--orange-light)",
            border: "1px solid rgba(255,107,0,0.35)",
          }}
        >
          Foco: {workoutSheet?.focus || "Não definido"}
        </span>
      </div>

      <p className="text-soft" style={{ marginBottom: 16, fontSize: "0.82rem" }}>
        {workoutSheet?.description ||
          "Faça o teste de biotipo no AlphaBot para gerar uma ficha personalizada."}
      </p>

      <div style={{ display: "grid", gap: 8 }}>
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span
                style={{
                  minWidth: 36,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "var(--orange-light)",
                  letterSpacing: "0.06em",
                }}
              >
                {item.day}
              </span>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {item.type} • {item.sets || "-"} séries • {item.reps || "-"}
                </div>
              </div>

              <button
                className="btn-secondary"
                disabled={checkLoading}
                onClick={() => onCheckIn(item.name)}
                style={{
                  padding: "8px 12px",
                  fontSize: "0.75rem",
                  whiteSpace: "nowrap",
                }}
              >
                {checkLoading ? "Salvando..." : "Check-in"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-soft">
            Nenhuma ficha encontrada para este aluno.
          </p>
        )}
      </div>
    </div>
  );
}