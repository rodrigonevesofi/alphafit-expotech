# Integração Ollama no ALPHAFIT

## Fluxo

```txt
Front-end ChatbotBox.jsx
  -> POST /chat/message
Back-end Express
  -> monta prompt com histórico
  -> chama Ollama local
Ollama llama3.2:1b
  -> responde
Back-end salva em SQLite
  -> retorna para o front
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

Body:

```json
{
  "message": "Quero um treino para hipertrofia treinando 4 dias por semana",
  "sessionId": "teste-swagger",
  "userId": 1
}
```
