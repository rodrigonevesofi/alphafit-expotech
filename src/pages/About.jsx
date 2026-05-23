import Header from "../components/layout/Header";
import SectionTitle from "../components/layout/SectionTitle";
import mascot from "../assets/cyborg_man.png";

export default function About() {
  return (
    <div className="app-bg h-screen flex flex-col overflow-y-auto">
      <Header />
      <div className="flex-grow container py-6 flex flex-col justify-center">
        <SectionTitle
          badge="Sobre Nós"
          title="Conheça a AlphaFit"
          subtitle="Muito mais que uma academia, somos um projeto dedicado à sua saúde."
        />
        
        <div className="grid-2 mt-4 items-center">
          <div className="glass card p-6 flex flex-col justify-center text-center items-center">
            <img src={mascot} alt="Mascote AlphaFit" className="w-24 h-24 mb-4 drop-shadow-[0_0_15px_rgba(255,107,0,0.4)] animate-float-robot" />
            <h2 className="text-xl font-bold mb-3">A nossa Missão</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Democratizar o acesso a treinos inteligentes. Unindo tecnologia de ponta com a nossa Inteligência Artificial (AlphaBot), 
              proporcionamos uma experiência única para você extrair o melhor da sua performance, respeitando o seu biotipo e os seus limites.
            </p>
          </div>
          
          <div className="glass card">
            <h3 className="text-xl font-bold mb-4">Nossos Valores</h3>
            <div className="user-info-list space-y-4">
              <div className="user-info-item">
                <strong>Inovação</strong>
                <span className="text-sm text-white/70">Uso de IA para treinos</span>
              </div>
              <div className="user-info-item">
                <strong>Superação</strong>
                <span className="text-sm text-white/70">Apoio a cada repetição</span>
              </div>
              <div className="user-info-item">
                <strong>Comunidade</strong>
                <span className="text-sm text-white/70">Um ambiente para todos</span>
              </div>
              <div className="user-info-item">
                <strong>Tecnologia</strong>
                <span className="text-sm text-white/70">Painel completo de evolução</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
