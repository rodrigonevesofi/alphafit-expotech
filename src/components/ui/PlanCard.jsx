export default function PlanCard({ plan, onSelect }) {
  const isHighlight = plan.destaque?.toLowerCase().includes("escolhido") || plan.destaque?.toLowerCase().includes("popular") || plan.destaque?.toLowerCase().includes("recomendado");

  return (
    <article
      className={`card group transition-all duration-300 relative mt-8 md:mt-0 flex flex-col ${
        isHighlight
          ? "glass bg-gradient-to-br from-orange-500/30 to-orange-500/5 border-orange-500/50 shadow-[0_0_20px_rgba(255,107,0,0.3)] z-10"
          : "glass opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] hover:border-orange-500 border-white/10"
      }`}
    >
      {isHighlight && plan.destaque && (
        <div className="absolute left-0 w-full text-white text-center py-2 text-sm font-black uppercase tracking-widest rounded-t-[16px] shadow-[0_4px_20px_rgba(255,107,0,0.35)] plan-highlight-bar">
          {plan.destaque}
        </div>
      )}

      <h3 className={`text-[1.8rem] font-black uppercase tracking-wide mb-2 text-white`}>
        {plan.nome}
      </h3>

      {(plan.subDestaque || plan.destaque) && (
        <span 
          className="tag plan-sub-tag" 
        >
          {plan.subDestaque || plan.destaque}
        </span>
      )}
      
      <div className="mb-5">
        <span className={`text-[2rem] font-black text-white`}>{plan.preco}</span>
        <span className="text-muted">/mês</span>
      </div>

      <ul className="list-none grid gap-2 mb-5 flex-1">
        {plan.beneficios.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-[0.88rem] text-white/75"
          >
            <span className="text-[0.7rem] text-orange-400">◆</span>
            {item}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        className={`full transition-all duration-300 mt-auto ${
          isHighlight 
            ? "btn-primary" 
            : "btn-secondary group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,107,0,0.5)]"
        }`}
      >
        Conhecer
      </button>
    </article>
  );
}
