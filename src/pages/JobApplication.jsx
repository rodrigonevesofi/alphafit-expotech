import Header from "../components/layout/Header";
import SectionTitle from "../components/layout/SectionTitle";

export default function JobApplication() {
  return (
    <div className="app-bg h-screen flex flex-col overflow-y-auto">
      <Header />
      <div className="flex-grow container py-6 flex flex-col justify-center">
        <SectionTitle
          badge="Carreiras"
          title="Trabalhe Conosco"
          subtitle="Faça parte do time que está revolucionando o mundo fitness com tecnologia."
        />
        
        <div className="max-w-3xl mx-auto mt-4 w-full">
          <div className="glass card p-5">
            <h3 className="text-lg font-bold mb-2">Vagas Abertas</h3>
            <p className="text-white/70 mb-4 text-sm">
              Atualmente estamos recebendo currículos para o nosso banco de talentos. Preencha o formulário abaixo e entraremos em contato quando surgir uma oportunidade alinhada ao seu perfil.
            </p>

            <form className="form flex flex-col gap-3 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="small-label block mb-1">Nome</label>
                  <input type="text" placeholder="Seu nome" className="w-full py-2" required />
                </div>
                <div>
                  <label className="small-label block mb-1">E-mail</label>
                  <input type="email" placeholder="email@exemplo.com" className="w-full py-2" required />
                </div>
                <div>
                  <label className="small-label block mb-1">Telefone</label>
                  <input type="tel" placeholder="(11) 99999-9999" className="w-full py-2" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="small-label block mb-1">Área de Interesse</label>
                  <select className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl py-2 px-3 text-white focus:border-[var(--orange)] outline-none transition-colors">
                    <option value="" disabled selected>Selecione...</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="educacao_fisica">Educação Física</option>
                    <option value="atendimento">Atendimento</option>
                  </select>
                </div>
                <div>
                  <label className="small-label block mb-1">Anexar Currículo</label>
                  <input type="file" accept=".pdf" className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl py-[5px] px-3 text-white text-sm" required />
                </div>
              </div>
              <div className="mt-3">
                <label className="small-label block mb-1">Fale sobre você</label>
                <textarea placeholder="Breve resumo..." className="w-full min-h-[60px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-2 text-white outline-none resize-none"></textarea>
              </div>
              <button type="button" className="btn-primary w-full mt-4">Enviar Currículo</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
