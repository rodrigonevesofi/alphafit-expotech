export default function AdminMetrics() {
  const metrics = [
    { label: "Alunos ativos",   value: "1.248", icon: "👥", progress: 82, color: "" },
    { label: "Planos vendidos", value: "368",   icon: "📋", progress: 61, color: "" },
    { label: "Atendimentos IA", value: "2.314", icon: "🤖", progress: 94, color: "cyan" },
    { label: "Retenção",        value: "91%",   icon: "📈", progress: 91, color: "cyan" },
  ];

  return (
    <div className="grid-4 section-gap">
      {metrics.map((item) => (
        <div key={item.label} className="metric-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="small-label">{item.label}</p>
            <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
          </div>
          <div className="metric-value">{item.value}</div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${item.color}`}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
