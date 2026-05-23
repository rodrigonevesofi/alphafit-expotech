import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import StudentMetrics from "../components/dashboard/StudentMetrics";
import StudentWorkout from "../components/dashboard/StudentWorkout";
import StudentSchedule from "../components/dashboard/StudentSchedule";
import StudentDiet from "../components/dashboard/StudentDiet";
import StudentFeed from "../components/dashboard/StudentFeed";
import PlanCard from "../components/ui/PlanCard";

import { useAuth } from "../context/AuthContext";
import { plans } from "../data/plans";
import cyborgMan from "../assets/cyborg_man.png";

import {
  apiGetStudentDashboard,
  apiCreateWorkoutCheckIn,
} from "../services/api";

export default function StudentDashboard() {
  const { user, updateUser } = useAuth();

  const [showPlansModal, setShowPlansModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });

  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [checkLoading, setCheckLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  async function loadDashboard() {
    if (!user?.id) {
      setLoadingDashboard(false);
      return;
    }

    setLoadingDashboard(true);
    setDashboardError("");

    try {
      const data = await apiGetStudentDashboard(user.id);

      if (!data.success) {
        setDashboardError(data.message || "Erro ao carregar o painel.");
        return;
      }

      setDashboard(data);
    } catch (error) {
      setDashboardError("Erro ao conectar com o servidor.");
    } finally {
      setLoadingDashboard(false);
    }
  }

  useEffect(() => {
    loadDashboard();

    function refreshDashboard() {
      loadDashboard();
    }

    window.addEventListener("alphafit-dashboard-refresh", refreshDashboard);

    return () => {
      window.removeEventListener("alphafit-dashboard-refresh", refreshDashboard);
    };
  }, [user?.id]);

  async function handleCheckIn(workoutName) {
    if (!user?.id || !workoutName) return;

    setCheckLoading(true);

    try {
      const data = await apiCreateWorkoutCheckIn(user.id, workoutName);

      if (!data.success) {
        alert(data.message || "Erro ao registrar check-in.");
        return;
      }

      await loadDashboard();
    } catch (error) {
      alert("Erro ao registrar o check-in.");
    } finally {
      setCheckLoading(false);
    }
  }

  function handleEditProfile() {
    if (isEditingProfile) {
      updateUser(editData);
      setIsEditingProfile(false);
    } else {
      setEditData({ name: user?.name || "", email: user?.email || "" });
      setIsEditingProfile(true);
    }
  }

  if (loadingDashboard) {
    return (
      <DashboardLayout title="Painel do aluno">
        <div className="glass card">
          <h3>Carregando seu painel...</h3>
          <p className="text-soft">
            Estamos buscando seus dados de treino, dieta, agenda e evolução.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (dashboardError) {
    return (
      <DashboardLayout title="Painel do aluno">
        <div className="glass card">
          <h3>Não foi possível carregar o painel</h3>
          <p className="text-soft" style={{ marginBottom: 16 }}>
            {dashboardError}
          </p>
          <button className="btn-primary" onClick={loadDashboard}>
            Tentar novamente
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Painel do aluno">
      <div className="dashboard-hero">
        <div>
          <span className="tag">Seu progresso</span>
          <h1>Olá, {user?.name?.split(" ")[0] || "Aluno"} 👊</h1>
          <p className="text-soft" style={{ marginTop: 6 }}>
            Acompanhe seus treinos, agenda, dieta e comunidade.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            className="dashboard-user-box cursor-pointer hover:border-orange-500/50 transition-colors"
            onClick={() => setShowProfileModal(true)}
          >
            <div className="small-label">Aluno</div>
            <h2>{user?.name || "Usuário"}</h2>
            <span className="badge-pending">Ativo</span>
          </div>
        </div>
      </div>

      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-orange-600/20 to-orange-500/5 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>

        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            Você ainda não possui um plano ativo! ⚠️
          </h2>
          <p className="text-white/80 text-sm">
            Contrate agora o seu plano e mude seu Shape! Desbloqueie todos os recursos.
          </p>
        </div>

        <button
          onClick={() => setShowPlansModal(true)}
          className="btn-primary whitespace-nowrap shadow-[0_0_20px_rgba(255,107,0,0.3)]"
        >
          Ver Planos
        </button>
      </div>

      <StudentMetrics dashboard={dashboard} user={user} />

      <div className="grid-2 section-gap">
        <StudentDiet dashboard={dashboard} />
        <StudentWorkout
          dashboard={dashboard}
          onCheckIn={handleCheckIn}
          checkLoading={checkLoading}
        />
      </div>

      <div className="grid-2 section-gap">
        <div className="glass card">
          <h3>Resumo da semana</h3>
          <p className="text-soft" style={{ marginBottom: 16 }}>
            Dados calculados com base nos check-ins registrados.
          </p>

          <div className="user-info-list">
            <div className="user-info-item">
              <strong>Semana</strong>
              <span>{dashboard?.summary?.currentWeek || "—"}</span>
            </div>

            <div className="user-info-item">
              <strong>Frequência</strong>
              <span>{dashboard?.summary?.completedThisWeek || 0} treinos</span>
            </div>

            <div className="user-info-item">
              <strong>Meta semanal</strong>
              <span>
                {dashboard?.summary?.completedThisWeek || 0}/
                {dashboard?.summary?.weeklyGoal || 0}
              </span>
            </div>

            <div className="user-info-item">
              <strong>Pendentes</strong>
              <span>{dashboard?.summary?.pendingThisWeek || 0}</span>
            </div>

            <div className="user-info-item">
              <strong>Próximo foco</strong>
              <span>{dashboard?.profile?.focus || "Consistência"}</span>
            </div>
          </div>
        </div>

        <StudentSchedule dashboard={dashboard} />
      </div>

      <div className="section-gap">
        <StudentFeed />
      </div>

      {showPlansModal && !selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass card w-full max-w-5xl relative p-8 m-auto">
            <button
              onClick={() => setShowPlansModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">
              Escolha seu plano
            </h2>

            <div className="grid-3 pt-12">
              {plans.map((plan) => (
                <PlanCard key={plan.nome} plan={plan} onSelect={setSelectedPlan} />
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedPlan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass card max-w-lg w-full relative">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              ✕
            </button>

            {selectedPlan.destaque && (
              <span className="tag mb-4">{selectedPlan.destaque}</span>
            )}

            <h2 className="text-2xl font-bold mb-2">
              Plano {selectedPlan.nome}
            </h2>

            <div className="text-3xl font-black mb-6 text-orange-500">
              {selectedPlan.preco}{" "}
              <span className="text-sm text-white/50 font-normal">/mês</span>
            </div>

            <p className="text-white/80 mb-6 leading-relaxed">
              {selectedPlan.descricao}
            </p>

            <ul className="space-y-3 mb-8">
              {selectedPlan.beneficios.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/90"
                >
                  <span className="text-orange-500 text-xs">◆</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex gap-4 mt-auto">
              <button onClick={() => setSelectedPlan(null)} className="btn-secondary flex-1">
                Voltar
              </button>

              <button className="btn-primary flex-1">
                Contratar plano
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass card max-w-md w-full relative">
            <button
              onClick={() => {
                setShowProfileModal(false);
                setIsEditingProfile(false);
              }}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              ✕
            </button>

            <div className="flex justify-between items-center mb-6 pr-6">
              <h3 className="text-xl font-bold">Seus dados</h3>

              <button
                onClick={handleEditProfile}
                className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                  isEditingProfile
                    ? "bg-orange-500 text-black font-bold"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {isEditingProfile ? "Salvar" : "Editar campos"}
              </button>
            </div>

            <div className="user-info-list space-y-4">
              <div className="user-info-item flex-col items-start gap-2">
                <strong className="text-sm text-white/50 uppercase tracking-wider">
                  Nome
                </strong>

                {isEditingProfile ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-orange-500 outline-none"
                  />
                ) : (
                  <span className="text-lg">{user?.name || "—"}</span>
                )}
              </div>

              <div className="user-info-item flex-col items-start gap-2">
                <strong className="text-sm text-white/50 uppercase tracking-wider">
                  E-mail
                </strong>

                {isEditingProfile ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-orange-500 outline-none"
                  />
                ) : (
                  <span className="text-lg">{user?.email || "—"}</span>
                )}
              </div>

              <div className="user-info-item flex-col items-start gap-2">
                <strong className="text-sm text-white/50 uppercase tracking-wider">
                  Perfil
                </strong>
                <span className="text-lg text-white/50">
                  {user?.role === "student" ? "Aluno" : user?.role}
                </span>
              </div>

              <div className="user-info-item flex-col items-start gap-2">
                <strong className="text-sm text-white/50 uppercase tracking-wider">
                  Biotipo
                </strong>
                <span
                  className={`text-lg font-bold ${
                    user?.biotype ? "text-orange-500 capitalize" : "text-white/30"
                  }`}
                >
                  {user?.biotype || dashboard?.profile?.biotypeUsed || "Não definido"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Link
        to="/chatbot"
        className="fixed bottom-8 right-8 z-40 w-24 h-24 flex items-center justify-center hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(255,107,0,0.6)]"
        style={{ padding: 0, animation: "floatRobot 4s ease-in-out infinite" }}
      >
        <img src={cyborgMan} alt="AlphaBot" className="w-full h-full object-contain" />
      </Link>
    </DashboardLayout>
  );
}