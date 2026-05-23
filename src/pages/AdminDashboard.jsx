import DashboardLayout from "../components/layout/DashboardLayout";
import AdminMetrics from "../components/dashboard/AdminMetrics";
import AdminUsersTable from "../components/dashboard/AdminUsersTable";
import SprintBoard from "../components/dashboard/SprintBoard";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Área administrativa">
      <div className="dashboard-hero">
        <div>
          <span className="tag">Dashboard Admin</span>
          <h1>Bem-vindo, {user?.name?.split(" ")[0] || "Admin"}</h1>
          <p className="text-soft" style={{ marginTop: 6 }}>
            Gerencie alunos, métricas e acompanhe a operação.
          </p>
        </div>
        <div className="dashboard-user-box">
          <div className="small-label">Perfil</div>
          <h2>{user?.name || "Administrador"}</h2>
          <span className="badge-success">Administrador</span>
        </div>
      </div>

      <AdminMetrics />

      <div className="grid-2 section-gap">
        <AdminUsersTable />
        <SprintBoard />
      </div>
    </DashboardLayout>
  );
}
