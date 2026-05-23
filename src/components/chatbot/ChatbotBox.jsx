import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import mascot from "../../assets/cyborg_man.png";
import { apiSendChatMessage } from "../../services/api";
import { apiSaveStudentBiotype } from "../../services/api";

function MarkdownMessage({ text }) {
  return (
    <div style={{ fontSize: "0.95rem", lineHeight: "1.55" }}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p style={{ margin: "0 0 10px" }}>{children}</p>,
          strong: ({ children }) => (
            <strong style={{ color: "inherit", fontWeight: 700 }}>
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul style={{ margin: "8px 0 10px 18px", padding: 0 }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: "8px 0 10px 18px", padding: 0 }}>
              {children}
            </ol>
          ),
          li: ({ children }) => <li style={{ marginBottom: "6px" }}>{children}</li>,
          h1: ({ children }) => (
            <h4 style={{ margin: "8px 0", fontSize: "1rem" }}>
              {children}
            </h4>
          ),
          h2: ({ children }) => (
            <h4 style={{ margin: "8px 0", fontSize: "1rem" }}>
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h4 style={{ margin: "8px 0", fontSize: "1rem" }}>
              {children}
            </h4>
          ),
          code: ({ children }) => (
            <code
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "2px 6px",
                fontSize: "0.88rem",
              }}
            >
              {children}
            </code>
          ),
        }}
      >
        {text || ""}
      </ReactMarkdown>
    </div>
  );
}

const biotypeQuestions = [
  {
    q: "Como é a sua estrutura óssea e física natural?",
    options: [
      { label: "A) Fina e esguia, ombros estreitos.", type: "ecto" },
      { label: "B) Atlética, ombros largos e cintura fina.", type: "meso" },
      { label: "C) Larga e pesada, estrutura robusta.", type: "endo" },
    ],
  },
  {
    q: "Como o seu corpo reage ao ganho de peso?",
    options: [
      { label: "A) Tenho muita dificuldade para ganhar peso/músculo.", type: "ecto" },
      { label: "B) Ganho músculo e perco gordura com certa facilidade.", type: "meso" },
      { label: "C) Ganho peso rápido e tenho dificuldade para perder gordura.", type: "endo" },
    ],
  },
  {
    q: "Como é o seu metabolismo?",
    options: [
      { label: "A) Muito acelerado (queimo calorias rápido).", type: "ecto" },
      { label: "B) Equilibrado (responde bem a dieta/treino).", type: "meso" },
      { label: "C) Lento (acumulo gordura rápido se descuidar).", type: "endo" },
    ],
  },
];

export default function ChatbotBox() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateUser } = useAuth();

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Olá! Sou o Alphafit. Posso sugerir treinos, responder dúvidas e avaliar seu perfil físico.",
    },
  ]);

  const [testActive, setTestActive] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (inputRef.current && !testActive) {
      inputRef.current.focus();
    }
  }, [testActive]);

  useEffect(() => {
    if (searchParams.get("action") === "biotype") {
      setTestActive(true);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Vamos descobrir o seu Biotipo Corporal! Para isso, vou te fazer 3 perguntas rápidas.",
        },
        {
          type: "bot",
          text: biotypeQuestions[0].q,
          options: biotypeQuestions[0].options,
        },
      ]);

      searchParams.delete("action");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleOptionClick = (option) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === prev.length - 1 ? { ...m, options: null } : m))
    );

    setMessages((prev) => [...prev, { type: "user", text: option.label }]);

    const newAnswers = {
      ...answers,
      [option.type]: (answers[option.type] || 0) + 1,
    };

    setAnswers(newAnswers);

    const nextStep = step + 1;

    if (nextStep < biotypeQuestions.length) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: biotypeQuestions[nextStep].q,
            options: biotypeQuestions[nextStep].options,
          },
        ]);

        setStep(nextStep);
      }, 600);
    } else {
      setTimeout(() => {
        const result = Object.keys(newAnswers).reduce((a, b) =>
          newAnswers[a] > newAnswers[b] ? a : b
        );

        const biotypeName =
          result === "ecto"
            ? "Ectomorfo"
            : result === "meso"
            ? "Mesomorfo"
            : "Endomorfo";

        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: `Análise concluída! O seu biotipo predominante é **${biotypeName}**.`,
          },
          {
            type: "bot",
            text: "Salvei essa informação no seu perfil e vou considerar isso nas próximas sugestões de treino.",
          },
        ]);

const normalizedBiotype = biotypeName.toLowerCase();

updateUser({ biotype: normalizedBiotype });

if (user?.id) {
  apiSaveStudentBiotype(user.id, normalizedBiotype).then(() => {
    window.dispatchEvent(new Event("alphafit-dashboard-refresh"));
  });
}

setTestActive(false);
      }, 1000);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    const sessionId = user?.id ? `alphafit-user-${user.id}` : "alphafit-guest";

    setMessages((prev) => [...prev, { type: "user", text: userText }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const data = await apiSendChatMessage(userText, sessionId, user?.id || null);

      if (!data.success) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text:
              data.message ||
              "Não consegui responder agora. Verifique se o Ollama está rodando.",
          },
        ]);

        return;
      }

      setMessages((prev) => [...prev, { type: "bot", text: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Não consegui conectar com o servidor. Confirme se o back-end está rodando em http://localhost:3333.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass card chatbot-container">
      <div className="chatbot-header">
        <img
          src={mascot}
          alt="AlphaBot Mascote Pixel Art"
          className="chatbot-avatar animate-float-robot"
        />

        <div>
          <h3 className="mb-0.5">AlphaBot</h3>
          <span className="chatbot-status">
            ● Online
          </span>
        </div>
      </div>

      <div className="form chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`glass card chatbot-msg ${msg.type === "bot" ? "chatbot-msg-bot" : "chatbot-msg-user"}`}
          >
            <div className="chatbot-msg-row">
              {msg.type === "bot" && (
                <img
                  src={mascot}
                  alt="Bot Avatar"
                  className="chatbot-avatar-sm animate-float-robot"
                />
              )}

              <div style={{ flexGrow: 1 }}>
                <strong
                  className={`block mb-1 ${msg.type === "bot" ? "text-orange" : "text-white"}`}
                >
                  {msg.type === "bot"
                    ? "AlphaBot"
                    : user?.name?.split(" ")[0] || "Você"}
                </strong>

                <MarkdownMessage text={msg.text} />
              </div>

              {msg.type === "user" && (
                <div className="chatbot-user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>

            {msg.options && (
              <div className="chatbot-options">
                {msg.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(opt)}
                    className="text-left bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500 px-4 py-3 rounded-xl transition-colors text-sm"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="glass card chatbot-msg chatbot-msg-bot">
            <div className="chatbot-typing-row">
              <img
                src={mascot}
                alt="Bot Avatar"
                className="chatbot-avatar-typing animate-float-robot"
              />

              <strong style={{ color: "var(--orange-light)" }}>
                AlphaBot está digitando...
              </strong>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="form chatbot-form"
      >
        <input
          ref={inputRef}
          type="text"
          autoFocus
          placeholder={
            testActive ? "Responda às opções acima..." : "Digite sua pergunta..."
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={testActive || isTyping}
          className="flex-grow"
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={testActive || isTyping || !inputValue.trim()}
        >
          {isTyping ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}