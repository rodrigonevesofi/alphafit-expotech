export default function StudentDiet({ dashboard }) {
  const dietPlan = dashboard?.dietPlan;
  const meals = dietPlan?.meals || [];

  return (
    <div className="glass card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <h3>Plano Alimentar</h3>

        <span
          className="badge-success"
          style={{
            background: "rgba(255,107,0,0.12)",
            color: "var(--orange-light)",
            border: "1px solid rgba(255,107,0,0.35)",
          }}
        >
          Foco: {dietPlan?.focus || "Não definido"}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          {dietPlan?.description ||
            "Faça o teste de biotipo no AlphaBot para gerar um plano alimentar inicial."}
        </p>

        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: 800,
            color: "var(--orange-light)",
            whiteSpace: "nowrap",
            marginLeft: "12px",
          }}
        >
          {dietPlan?.totalKcal || "Ajustável"}
        </span>
      </div>

      <div className="user-info-list">
        {meals.length > 0 ? (
          meals.map((item) => (
            <div
              key={item.id}
              className="user-info-item"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <strong style={{ color: "var(--orange-light)" }}>
                  {item.mealName}
                </strong>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {item.time || "—"}
                </span>
              </div>

              <p style={{ fontSize: "0.9rem", color: "var(--text-soft)" }}>
                {item.items}
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--cyan)" }}>
                  {item.kcal || "Ajustável"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-soft">
            Nenhum plano alimentar encontrado para este aluno.
          </p>
        )}
      </div>
    </div>
  );
}