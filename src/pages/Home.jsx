import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SectionTitle from "../components/layout/SectionTitle";
import FeatureCard from "../components/ui/FeatureCard";
import PlanCard from "../components/ui/PlanCard";
import { features } from "../data/features";
import { plans } from "../data/plans";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import gymWoman from "../assets/gym-woman.jpg";
import gymDumbbells from "../assets/gym-dumbbells.jpg";
import gymTreadmills from "../assets/gym-treadmills.jpg";
import gymTurf from "../assets/gym-turf.jpg";
import gymMan from "../assets/gym-man.jpg";
import cyborgMan from "../assets/cyborg_man.png";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-text", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
      gsap.from(".hero-card", { x: 50, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out" });

      // Sections Scroll Animation
      gsap.utils.toArray(".gsap-section").forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="app-bg" ref={containerRef}>
      <Header />

      {/* Hero */}
      <section className="hero container relative">
        {/* Background Image Hero */}
        <div className="absolute inset-0 z-0 rounded-[40px] overflow-hidden opacity-50">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />
          <img src={gymWoman} alt="Mulher treinando" className="w-full h-full object-cover object-[center_20%]" />
        </div>

        <div className="hero-text relative z-10" style={{ paddingLeft: "5%" }}>
          <span className="tag">Plataforma fitness</span>
          <h1>
            Treine com <span className="gradient-text">inteligência</span> e evolua de verdade
          </h1>
          <p>
            Sistema web completo com dashboards personalizados, acompanhamento de treinos,
            gestão de alunos e assistente virtual integrado.
          </p>

          <div className="hero-actions">
            {user ? (
              <Link
                to={user.role === "admin" ? "/admin" : "/aluno"}
                className="btn-primary"
              >
                Ir para o painel
              </Link>
            ) : (
              <Link to="/auth" className="btn-primary">Começar agora</Link>
            )}
          </div>
        </div>

        <div className="hero-card glass relative z-10">
          <p className="small-label" style={{ marginBottom: 16 }}>Preview do sistema</p>
          <div className="user-info-list">
            <div className="user-info-item">
              <strong>Treino do dia</strong>
              <span>Hipertrofia A — Peito e Tríceps</span>
            </div>
            <div className="user-info-item">
              <strong>Meta semanal</strong>
              <span>4 treinos • 2 concluídos</span>
            </div>
            <div className="user-info-item">
              <strong>Assistente virtual</strong>
              <span style={{ color: "#7cfc98" }}>● Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container section gsap-section">
        <div className="grid-3">
          {[
            { label: "Alunos ativos", value: "1.200+" },
            { label: "Treinos cadastrados", value: "340+" },
            { label: "Satisfação", value: "98%" },
          ].map((stat) => (
            <div key={stat.label} className="glass card" style={{ textAlign: "center" }}>
              <p className="metric-value">{stat.value}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 8 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container section gsap-section">
        <SectionTitle
          badge="Recursos"
          title="Tudo que você precisa"
          subtitle="Uma plataforma completa para gerenciar sua academia e acompanhar a evolução dos alunos."
        />
        <div className="grid-4">
          {features.map((item, i) => (
            <FeatureCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Nossa Estrutura */}
      <section className="container section gsap-section">
        <SectionTitle
          badge="A Estrutura"
          title="O ambiente perfeito"
          subtitle="Equipamentos de última geração em um espaço amplo focado em resultados reais."
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
          {/* Main big image */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden relative group border border-white/5 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 z-10" />
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="text-3xl font-bold text-white mb-2">Área de Performance</h3>
              <p className="text-white/70">Espaço livre para levantamento de peso e crossfit.</p>
            </div>
            <img src={gymTurf} alt="Espaço de Crossfit" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          {/* Two small images */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1 rounded-3xl overflow-hidden relative group border border-white/5 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <h4 className="text-xl font-bold text-white">Cardio Premium</h4>
              </div>
              <img src={gymTreadmills} alt="Esteiras" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex-1 rounded-3xl overflow-hidden relative group border border-white/5 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <h4 className="text-xl font-bold text-white">Pesos Livres</h4>
              </div>
              <img src={gymDumbbells} alt="Halteres" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        </div>
      </section>

      {/* Biotipos Corporais */}
      <section className="container section gsap-section">
        <SectionTitle
          badge="Biotipos Corporais"
          title="Treino Inteligente para o seu corpo"
          subtitle="A nossa Inteligência Artificial identifica seu biotipo e adapta os exercícios para maximizar seus resultados."
        />
        <div className="grid-3">
          <div className="glass card hover:border-orange-500/50">
            <h3 className="text-xl font-bold mb-2">Ectomorfo</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Estrutura esbelta, ossos finos, metabolismo acelerado e muita dificuldade para ganhar peso ou massa muscular.
            </p>
          </div>
          <div className="glass card hover:border-orange-500/50">
            <h3 className="text-xl font-bold mb-2">Mesomorfo</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Estrutura naturalmente atlética, ganha massa muscular com facilidade e perde gordura rápido. Possui facilidade para definição.
            </p>
          </div>
          <div className="glass card hover:border-orange-500/50">
            <h3 className="text-xl font-bold mb-2">Endomorfo</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Estrutura óssea mais larga, metabolismo mais lento e grande facilidade para acumular gordura, mas também ganha músculos facilmente.
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="container section gsap-section">
        <SectionTitle
          badge="Planos"
          title="Escolha seu plano"
          subtitle="Opções para todos os perfis, do iniciante ao avançado."
        />
        <div className="grid-3 pt-10">
          {plans.map((plan) => (
            <PlanCard key={plan.nome} plan={plan} onSelect={setSelectedPlan} />
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="container section gsap-section mb-12">
          <div className="glass card overflow-hidden p-0 border border-orange-500/20 rounded-[32px]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 md:p-16 flex flex-col justify-center items-start text-left">
                <span className="tag">Comece hoje</span>
                <h2 style={{ fontSize: "3rem", fontWeight: 900, margin: "16px 0 20px", lineHeight: "1.1" }}>
                  Pronto para <span className="gradient-text">transformar</span> seu treino?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 36, fontSize: "1.1rem", lineHeight: "1.6" }}>
                  Junte-se aos melhores. Crie sua conta gratuitamente e tenha acesso ao painel completo da AlphaFit, planilhas inteligentes e conexão direta com a comunidade.
                </p>
                <Link to="/auth" className="btn-primary shadow-[0_0_30px_rgba(255,107,0,0.3)] px-10 py-4 text-lg">Criar conta grátis</Link>
              </div>
              <div className="h-[300px] lg:h-auto relative">
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/50 to-transparent z-10" />
                <img src={gymMan} alt="Homem Remando" className="w-full h-full object-cover object-left" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modal do Plano */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
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
            <h2 className="text-2xl font-bold mb-2">Plano {selectedPlan.nome}</h2>
            <div className="text-3xl font-black mb-6 text-orange-500">{selectedPlan.preco} <span className="text-sm text-white/50 font-normal">/mês</span></div>
            
            <p className="text-white/80 mb-6 leading-relaxed">
              {selectedPlan.descricao}
            </p>

            <ul className="space-y-3 mb-8">
            {selectedPlan.beneficios.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/90">
                <span className="text-orange-500 text-xs">◆</span>
                {item}
              </li>
            ))}
            </ul>

            <div className="flex gap-4 mt-auto">
              <button 
                onClick={() => setSelectedPlan(null)}
                className="btn-secondary flex-1"
              >
                Voltar
              </button>
              <button className="btn-primary flex-1">
                Contratar plano
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Botão Flutuante do AlphaBot */}
      <Link 
        to="/chatbot" 
        className="fixed bottom-8 right-8 z-40 w-24 h-24 flex items-center justify-center hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(255,107,0,0.6)]"
        style={{ padding: 0, animation: "floatRobot 4s ease-in-out infinite" }}
      >
        <img src={cyborgMan} alt="AlphaBot" className="w-full h-full object-contain" />
      </Link>
    </div>
  );
}
