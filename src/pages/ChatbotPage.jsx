import Header from "../components/layout/Header";
import ChatbotBox from "../components/chatbot/ChatbotBox";

export default function ChatbotPage() {
  return (
    <div className="app-bg">
      <Header />

      <section className="container section">
        <span className="tag">Chatbot</span>
        <h1>Assistente virtual da AlphaFit</h1>
        <p className="section-subtitle">
          Sugestões de treino, dúvidas e atendimento com IA.
        </p>

        <ChatbotBox />
      </section>
    </div>
  );
}