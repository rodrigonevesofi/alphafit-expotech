# Integração Ollama no ALPHAFIT

## Fluxo

```txt
Front-end ChatbotBox.jsx
  -> POST /chat/message/stream
Back-end Express
  -> monta prompt com histórico
  -> chama Ollama local com streaming
Ollama llama3.2:1b
  -> envia partes da resposta
Back-end salva em SQLite
  -> retorna os eventos para o front
```

## Arquivos principais

```txt
src/components/chatbot/ChatbotBox.jsx
src/services/api.js
back-end/src/controllers/chatController.ts
back-end/src/services/ollamaService.ts
back-end/src/services/alphaPrompt.ts
back-end/src/models/ChatMessage.ts
```

## Teste manual no Swagger

Acesse:

```txt
http://localhost:3333/api-docs
```

Use o endpoint:

```txt
POST /chat/message
```

Para testar o fluxo usado pela tela, use tambem:

```txt
POST /chat/message/stream
```

Body:

```json
{
  "message": "Quero um treino para hipertrofia treinando 4 dias por semana",
  "sessionId": "teste-swagger",
  "userId": 1
}
```

## Ajustes de performance

O back-end aceita variaveis de ambiente para calibrar velocidade e tamanho da resposta:

```txt
OLLAMA_KEEP_ALIVE=10m
OLLAMA_NUM_PREDICT=320
OLLAMA_NUM_CTX=2048
OLLAMA_WARMUP_ENABLED=true
OLLAMA_WARMUP_INTERVAL_MS=480000
OLLAMA_WARMUP_TIMEOUT_MS=30000
OLLAMA_WARMUP_NUM_PREDICT=2
CHAT_HISTORY_LIMIT=6
CHAT_HISTORY_MESSAGE_CHARS=900
```

Quando a API sobe, ela faz uma chamada curta ao Ollama com o mesmo prompt base do AlphaBot para carregar o modelo e aquecer o contexto inicial.
Por padrao, o warm-up repete a cada 8 minutos para evitar que a primeira conversa apos um periodo ocioso fique lenta.

Para perguntas sobre dados pessoais do aluno, como treino de hoje, rotina, dieta e meta semanal, a API responde primeiro com os dados reais do painel.
Isso evita que o modelo invente ficha, horarios ou refeicoes quando a informação já existe no banco.

## Testes automatizados do chat

Para validar o roteamento do AlphaBot sem chamar o Ollama:

```bash
cd back-end
npm run test:chat
```

Esse teste usa SQLite em memoria e cobre saudacao, memoria curta da conversa, treino de hoje, treino leve, pre-treino, meta semanal, usuario sem login e respostas de seguranca.
