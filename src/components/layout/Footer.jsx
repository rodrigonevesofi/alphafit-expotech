import { Link } from "react-router-dom";
import mascot from "../../assets/Logo-azul.png";
import { useAuth } from "../../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="footer bg-black/40 backdrop-blur-md border-t border-white/10 mt-12 py-12 text-sm text-white/70 relative z-10">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <img src={mascot} alt="AlphaBot" className="w-8 h-8 object-contain" />
            <h3 className="text-xl font-bold text-white">AlphaFit</h3>
          </div>
          <p className="leading-relaxed">
            Projeto acadêmico focado em tecnologia e IA no ecossistema fitness.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-wider mb-2">Institucional</h4>
          <Link to="/sobre" className="hover:text-orange-500 transition-colors">Sobre Nós</Link>
          <Link to="/trabalhe-conosco" className="hover:text-orange-500 transition-colors">Trabalhe Conosco</Link>
          <Link to="/contato" className="hover:text-orange-500 transition-colors">Fale Conosco</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-wider mb-2">Plataforma</h4>
          <Link to="/produtos" className="hover:text-orange-500 transition-colors">Nossa Loja</Link>
          <Link to="/noticias" className="hover:text-orange-500 transition-colors">Mundo Fit (Notícias)</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-wider mb-2">Redes Sociais</h4>
          <a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            Instagram
          </a>
          <a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            YouTube
          </a>
          <a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            Twitter
          </a>
          
          <div className="mt-2 pt-2">
            <p className="text-xs text-white/50">Endereço: Rua do Robozinho, 123 - Centro</p>
          </div>
        </div>
      </div>
      
      <div className="container border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-xs">
        <p>AlphaFit © 2026 • Projeto acadêmico. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
