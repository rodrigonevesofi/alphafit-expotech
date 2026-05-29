import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "ALPHAFIT API", version: "1.0.0" },
    servers: [{ url: "http://localhost:3333" }],
    paths: {
      "/auth/register": { post: { summary: "Cadastrar usuário", responses: { 201: { description: "Criado" } } } },
      "/auth/login": { post: { summary: "Login", responses: { 200: { description: "OK" } } } },
      "/auth/users": { get: { summary: "Listar usuários" }, post: { summary: "Criar usuário" } },
      "/chat/message": { post: { summary: "Enviar mensagem para o AlphaBot/Ollama", responses: { 200: { description: "Resposta gerada" } } } },
      "/chat/message/stream": { post: { summary: "Enviar mensagem para o AlphaBot/Ollama com resposta em streaming", responses: { 200: { description: "Resposta gerada em eventos SSE" } } } },
      "/chat/history/{sessionId}": { get: { summary: "Histórico do chat" } },
      "/exercises": { get: { summary: "Listar exercícios" }, post: { summary: "Criar exercício" } },
      "/workout-plans": { get: { summary: "Listar planos" }, post: { summary: "Criar plano" } },
    }
  },
  apis: []
});
