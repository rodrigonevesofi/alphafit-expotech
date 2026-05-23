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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
    <div
      className="glass card"
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "70vh",
        maxHeight: "800px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "12px",
          flexShrink: 0,
        }}
      >
        <img
          src={mascot}
          alt="AlphaBot Mascote Pixel Art"
          style={{
            width: "64px",
            height: "64px",
            objectFit: "contain",
            imageRendering: "auto",
            animation: "floatRobot 3s ease-in-out infinite",
          }}
        />

        <div>
          <h3 style={{ marginBottom: "2px" }}>AlphaBot</h3>
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--success)",
              fontWeight: "600",
            }}
          >
            ● Online
          </span>
        </div>
      </div>

      <div
        className="form"
        style={{
          flexGrow: 1,
          overflowY: "auto",
          paddingRight: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className="glass card"
            style={{
              marginLeft: msg.type === "user" ? "40px" : "0",
              marginRight: msg.type === "bot" ? "40px" : "0",
              background:
                msg.type === "bot"
                  ? "rgba(255,107,0,0.05)"
                  : "rgba(255,255,255,0.03)",
              borderColor:
                msg.type === "bot" ? "rgba(255,107,0,0.2)" : "var(--border)",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              {msg.type === "bot" && (
                <img
                  src={mascot}
                  alt="Bot Avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    flexShrink: 0,
                    objectFit: "contain",
                    imageRendering: "auto",
                    animation: "floatRobot 3s ease-in-out infinite",
                  }}
                />
              )}

              <div style={{ flexGrow: 1 }}>
                <strong
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    color:
                      msg.type === "bot"
                        ? "var(--orange-light)"
                        : "var(--white)",
                  }}
                >
                  {msg.type === "bot"
                    ? "AlphaBot"
                    : user?.name?.split(" ")[0] || "Você"}
                </strong>

                <MarkdownMessage text={msg.text} />
              </div>

              {msg.type === "user" && (
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "var(--blue)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    flexShrink: 0,
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>

            {msg.options && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginTop: "8px",
                  marginLeft: "52px",
                }}
              >
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
          <div
            className="glass card"
            style={{
              marginRight: "40px",
              background: "rgba(255,107,0,0.05)",
              borderColor: "rgba(255,107,0,0.2)",
              padding: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={mascot}
                alt="Bot Avatar"
                style={{
                  width: "36px",
                  height: "36px",
                  objectFit: "contain",
                  animation: "floatRobot 3s ease-in-out infinite",
                }}
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
        className="form"
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          placeholder={
            testActive ? "Responda às opções acima..." : "Digite sua pergunta..."
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={testActive || isTyping}
          style={{ flexGrow: 1 }}
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