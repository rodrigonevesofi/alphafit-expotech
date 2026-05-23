import Header from "../components/layout/Header";
import SectionTitle from "../components/layout/SectionTitle";

const newsItems = [
  { id: 1, title: "Os benefícios do treino de força", date: "Hoje", category: "Treino" },
  { id: 2, title: "Receitas pós-treino para ganho de massa", date: "Ontem", category: "Dieta" },
  { id: 3, title: "Como a AlphaFit usa IA para otimizar seus resultados", date: "Há 3 dias", category: "Tecnologia" },
  { id: 4, title: "Descanso também é treino: entenda a importância do sono", date: "Há 1 semana", category: "Saúde" },
];

export default function News() {
  return (
    <div className="app-bg h-screen flex flex-col overflow-y-auto">
      <Header />
      <div className="flex-grow container py-6 flex flex-col justify-center">
        <SectionTitle
          badge="Notícias"
          title="Mundo Fit"
          subtitle="Fique por dentro das últimas novidades e dicas para sua rotina."
        />
        
        <div className="grid-2 mt-4">
          {newsItems.map(item => (
            <div key={item.id} className="glass card hover:border-orange-500/50 cursor-pointer transition-colors">
              <span className="tag mb-3">{item.category}</span>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
