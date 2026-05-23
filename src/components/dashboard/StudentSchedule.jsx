import { Link } from "react-router-dom";

function formatEventDate(value) {
  if (!value) return "Data não informada";

  const date = new Date(value);

  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StudentSchedule({ dashboard }) {
  const events = dashboard?.schedule || [];

  return (
    <div className="glass card flex flex-col relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="mb-0">Agenda</h3>
          <p className="text-soft text-sm mt-1 mb-0">
            Compromissos e atividades da semana.
          </p>
        </div>
        <Link to="/agenda" className="text-orange-500 text-sm font-bold hover:underline whitespace-nowrap ml-2">
          Ver grade completa &rarr;
        </Link>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {events.length > 0 ? (
          events.map((item) => (
            <div
              key={item.id}
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
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {formatEventDate(item.eventDate)} • {item.type}
                </div>
              </div>

              <span
                className={
                  item.status === "completed" ? "badge-success" : "badge-pending"
                }
              >
                {item.status === "completed" ? "Concluído" : "Agendado"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-soft">
            Nenhuma atividade agendada para esta semana.
          </p>
        )}
      </div>
    </div>
  );
}