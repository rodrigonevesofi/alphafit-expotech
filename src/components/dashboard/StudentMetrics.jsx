import { useNavigate } from "react-router-dom";

export default function StudentMetrics({ dashboard, user }) {
  const navigate = useNavigate();

  const userBiotype = user?.biotype || dashboard?.profile?.biotypeUsed;

  const completedWorkouts = dashboard?.metrics?.completedWorkouts || 0;
  const completedThisWeek = dashboard?.summary?.completedThisWeek || 0;
  const weeklyGoal = dashboard?.summary?.weeklyGoal || 0;
  const evolution = dashboard?.metrics?.evolution || 0;

  const formattedBiotype = userBiotype
    ? String(userBiotype).charAt(0).toUpperCase() + String(userBiotype).slice(1)
    : "Descubra agora!";

  const metrics = [
    {
      label: "Frequência",
      value: String(completedWorkouts),
      progress: Math.min(evolution, 100),
      color: "",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      label: "Meta da semana",
      value: `${completedThisWeek}/${weeklyGoal}`,
      progress: weeklyGoal ? Math.min((completedThisWeek / weeklyGoal) * 100, 100) : 0,
      color: "",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      label: "Evolução",
      value: `${evolution}%`,
      progress: evolution,
      color: "cyan",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
          <polyline points="16 7 22 7 22 13"></polyline>
        </svg>
      ),
    },
    {
      label: "Seu Biotipo",
      value: formattedBiotype,
      progress: userBiotype ? 100 : 0,
      color: userBiotype ? "orange" : "cyan",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
  ];

  return (
    <div className="grid-4 section-gap">
      {metrics.map((item) => {
        const isBiotype = item.label === "Seu Biotipo";

        return (
          <div
            key={item.label}
            className={`metric-card ${
              isBiotype && !userBiotype
                ? "cursor-pointer hover:border-orange-500 hover:shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all"
                : ""
            }`}
            onClick={() => {
              if (isBiotype && !userBiotype) {
                navigate("/chatbot?action=biotype");
              }
            }}
          >
            <div className="metric-header">
              <p className="small-label">{item.label}</p>
              <span className="metric-icon">{item.icon}</span>
            </div>

            <div className={`metric-value ${isBiotype && userBiotype ? "text-orange-500" : ""}`}>
              {item.value}
            </div>

            <div className="progress-bar">
              <div
                className={`progress-fill ${item.color}`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}