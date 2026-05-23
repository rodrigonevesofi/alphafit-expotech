import Header from "../components/layout/Header";
import SectionTitle from "../components/layout/SectionTitle";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { state } = useLocation();
  const plan = state?.plan;
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  function handleConfirm() {
    if (plan) {
      updateUser({ ...user, plan: plan.nome });
    }
    navigate("/aluno");
  }

  return (
    <div className="app-bg h-screen flex flex-col overflow-y-auto">
      <Header />
      <div className="flex-grow container py-6 flex flex-col justify-center">
        <SectionTitle
          badge="Checkout"
          title="Finalize sua contratação"
          subtitle="Preencha os dados abaixo para confirmar a sua inscrição."
        />
        
        <div className="grid-2 mt-4">
          <div className="glass card p-5">
            <h3 className="text-lg font-bold mb-3">Resumo do Pedido</h3>
            <div className="user-info-list mb-6">
              <div className="user-info-item">
                <strong>Plano selecionado</strong>
                <span className="text-orange-500 font-bold">{plan ? `Plano ${plan.nome}` : "A definir"}</span>
              </div>
              <div className="user-info-item">
                <strong>Valor</strong>
                <span>{plan ? `${plan.preco} /mês` : "R$ 0,00 /mês"}</span>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-6">
              Você poderá alterar ou cancelar seu plano a qualquer momento no seu painel.
            </p>
          </div>

          <div className="glass card p-5">
            <h3 className="text-lg font-bold mb-3">Dados de Pagamento</h3>
            <form className="form flex flex-col gap-3 mt-0">
              <div>
                <label className="small-label block mb-1">Nome no Cartão</label>
                <input type="text" placeholder="Nome impresso no cartão" className="w-full" />
              </div>
              <div>
                <label className="small-label block mb-1">Número do Cartão</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="small-label block mb-1">Validade</label>
                  <input type="text" placeholder="MM/AA" className="w-full" />
                </div>
                <div className="flex-1">
                  <label className="small-label block mb-1">CVV</label>
                  <input type="text" placeholder="123" className="w-full" />
                </div>
              </div>
              <button type="button" onClick={handleConfirm} className="btn-primary mt-4 w-full">Confirmar Pagamento</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
