import Header from "../components/layout/Header";
import SectionTitle from "../components/layout/SectionTitle";

export default function Contact() {
  return (
    <div className="app-bg h-screen flex flex-col overflow-y-auto">
      <Header />
      <div className="flex-grow container py-6 flex flex-col justify-center">
        <SectionTitle
          badge="Contato"
          title="Fale Conosco"
          subtitle="Tem alguma dúvida ou sugestão? Envie uma mensagem para a nossa equipe."
        />
        
        <div className="grid-2 mt-4">
          <div className="glass card p-5">
            <h3 className="text-lg font-bold mb-3">Informações de Contato</h3>
            <div className="user-info-list">
              <div className="user-info-item">
                <strong>Telefone</strong>
                <span>(11) 4002-8922</span>
              </div>
              <div className="user-info-item">
                <strong>Email</strong>
                <span>contato@alphafit.com.br</span>
              </div>
              <div className="user-info-item">
                <strong>Endereço</strong>
                <span>Rua do Robozinho, 123 - Centro</span>
              </div>
              <div className="user-info-item">
                <strong>Horário</strong>
                <span>Seg a Sex - 06:00 às 23:00</span>
              </div>
            </div>
          </div>

          <div className="glass card p-5">
            <h3 className="text-lg font-bold mb-3">Envie uma mensagem</h3>
            <form className="form flex flex-col gap-3 mt-0">
              <div>
                <label className="small-label block mb-1">Seu Nome</label>
                <input type="text" placeholder="Digite seu nome completo" className="w-full" />
              </div>
              <div>
                <label className="small-label block mb-1">Seu Email</label>
                <input type="email" placeholder="email@exemplo.com" className="w-full" />
              </div>
              <div>
                <label className="small-label block mb-1">Mensagem</label>
                <textarea placeholder="Como podemos ajudar?" className="w-full min-h-[80px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[var(--orange)] outline-none transition-colors resize-y"></textarea>
              </div>
              <button type="button" className="btn-primary w-full mt-2">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
