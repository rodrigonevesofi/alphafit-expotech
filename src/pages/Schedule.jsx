import Header from "../components/layout/Header";
import SectionTitle from "../components/layout/SectionTitle";

const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const calendarData = {
  "07:00": ["Yoga", "Pilates", "Yoga", "Pilates", "Yoga"],
  "09:00": ["HIIT", "Zumba", "HIIT", "Zumba", "HIIT"],
  "18:00": ["Muay Thai", "Jiu Jitsu", "Muay Thai", "Jiu Jitsu", "Muay Thai"],
  "19:00": ["Pilates", "Yoga", "Pilates", "Yoga", "Pilates"],
  "20:00": ["Zumba", "Boxe", "Zumba", "Boxe", "Zumba"],
};

export default function Schedule() {
  return (
    <div className="app-bg h-screen flex flex-col overflow-y-auto">
      <Header />
      <div className="flex-grow container py-6 flex flex-col justify-center">
        <SectionTitle
          badge="Calendário"
          title="Nossa Agenda"
          subtitle="Planeje sua semana com as nossas modalidades exclusivas."
        />
        
        <div className="mt-4 overflow-x-auto w-full">
          <div className="glass card p-0 min-w-[700px]">
            {/* Cabecalho do Calendario */}
            <div className="grid grid-cols-6 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]">
              <div className="p-4 text-center font-bold text-orange-500 border-r border-[rgba(255,255,255,0.1)]">Horário</div>
              {weekDays.map((day, i) => (
                <div key={i} className="p-4 text-center font-bold text-white uppercase tracking-wider text-sm">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Corpo do Calendario */}
            <div className="divide-y divide-[rgba(255,255,255,0.05)]">
              {Object.keys(calendarData).map((time, idx) => (
                <div key={idx} className="grid grid-cols-6 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <div className="p-4 text-center font-black text-white/70 border-r border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                    {time}
                  </div>
                  {calendarData[time].map((className, colIdx) => (
                    <div key={colIdx} className="p-4 flex items-center justify-center border-r border-[rgba(255,255,255,0.05)] last:border-0">
                      <span className="bg-orange-500/10 border border-orange-500/30 text-orange-400 py-1 px-3 rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(255,107,0,0.1)] hover:bg-orange-500/20 cursor-pointer transition-colors text-center w-full">
                        {className}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
