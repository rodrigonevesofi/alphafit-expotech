import { Request, Response } from "express";
import { ChatMessage, User } from "../models";
import { askOllama, OllamaChatMessage, streamOllama } from "../services/ollamaService";
import { buildSystemPrompt, buildUserProfile } from "../services/alphaPrompt";
import { buildConversationMemoryAnswer, buildFitnessKnowledgeAnswer } from "../services/fitnessKnowledge";
import { buildDashboardDirectAnswer, buildStudentDashboardContext } from "../services/studentContext";

const CHAT_HISTORY_LIMIT = Number(process.env.CHAT_HISTORY_LIMIT || 6);
const MAX_HISTORY_MESSAGE_CHARS = Number(process.env.CHAT_HISTORY_MESSAGE_CHARS || 900);

function truncateForPrompt(value: string) {
  if (value.length <= MAX_HISTORY_MESSAGE_CHARS) return value;
  return `${value.slice(0, MAX_HISTORY_MESSAGE_CHARS).trim()}...`;
}

function mapHistoryToOllamaMessages(historyRows: any[]): OllamaChatMessage[] {
  return historyRows
    .filter((row: any) => row?.message)
    .map((row: any) => ({
      role: row.sender === "user" ? "user" : "assistant",
      content: truncateForPrompt(String(row.message)),
    }));
}

async function buildOllamaMessages(sessionId: string, userId: number | null, cleanMessage: string) {
  const [historyRowsDesc, user, studentDashboardContext] = await Promise.all([
    ChatMessage.findAll({
      where: { sessionId },
      order: [["createdAt", "DESC"]],
      limit: CHAT_HISTORY_LIMIT,
    }),
    userId ? User.findByPk(userId) : Promise.resolve(null),
    buildStudentDashboardContext(userId),
  ]);

  const historyRows = historyRowsDesc.reverse();
  const userProfile = buildUserProfile(user as any);
  const contextBlock = `${userProfile}\n\n${studentDashboardContext}`;

  return [
    {
      role: "system",
      content: buildSystemPrompt(contextBlock),
    },
    ...mapHistoryToOllamaMessages(historyRows),
    {
      role: "user",
      content: cleanMessage,
    },
  ] as OllamaChatMessage[];
}

function readMessageBody(req: Request) {
  const { message, sessionId = "default", userId = null } = req.body;
  const cleanMessage = String(message || "").trim();

  return {
    cleanMessage,
    sessionId: String(sessionId || "default"),
    userId: userId ? Number(userId) : null,
  };
}

async function saveUserMessage(sessionId: string, userId: number | null, cleanMessage: string) {
  await ChatMessage.create({
    sessionId,
    userId,
    sender: "user",
    message: cleanMessage,
  });
}

async function saveBotMessage(sessionId: string, userId: number | null, answer: string) {
  await ChatMessage.create({
    sessionId,
    userId,
    sender: "bot",
    message: answer,
  });
}

async function findLastUserMessage(sessionId: string) {
  const lastMessage = await ChatMessage.findOne({
    where: { sessionId, sender: "user" },
    order: [["createdAt", "DESC"]],
  });

  return lastMessage?.getDataValue?.("message") || null;
}

function sendStreamEvent(res: Response, event: string, payload: unknown) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const { cleanMessage, sessionId, userId } = readMessageBody(req);

    if (!cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "Mensagem obrigatória.",
      });
    }

    const lastUserMessage = await findLastUserMessage(sessionId);
    const conversationMemoryAnswer = buildConversationMemoryAnswer(cleanMessage, lastUserMessage);
    const directAnswer = conversationMemoryAnswer || (await buildDashboardDirectAnswer(userId, cleanMessage));
    const fitnessKnowledgeAnswer = directAnswer || buildFitnessKnowledgeAnswer(cleanMessage);
    if (fitnessKnowledgeAnswer) {
      await saveUserMessage(sessionId, userId, cleanMessage);
      await saveBotMessage(sessionId, userId, fitnessKnowledgeAnswer);

      return res.json({
        success: true,
        response: fitnessKnowledgeAnswer,
        sessionId,
      });
    }

    const ollamaMessages = await buildOllamaMessages(sessionId, userId, cleanMessage);
    await saveUserMessage(sessionId, userId, cleanMessage);

    const startedAt = Date.now();
    const answer = await askOllama(ollamaMessages);
    console.info(`[chat] resposta Ollama gerada em ${Date.now() - startedAt}ms`);

    await saveBotMessage(sessionId, userId, answer);

    return res.json({
      success: true,
      response: answer,
      sessionId,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Erro ao conversar com o Ollama. Verifique se o Ollama está rodando.",
      detail: error?.message,
    });
  }
}

export async function streamMessage(req: Request, res: Response) {
  try {
    const { cleanMessage, sessionId, userId } = readMessageBody(req);

    if (!cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "Mensagem obrigatória.",
      });
    }

    const lastUserMessage = await findLastUserMessage(sessionId);
    const conversationMemoryAnswer = buildConversationMemoryAnswer(cleanMessage, lastUserMessage);
    const directAnswer = conversationMemoryAnswer || (await buildDashboardDirectAnswer(userId, cleanMessage));
    const fitnessKnowledgeAnswer = directAnswer || buildFitnessKnowledgeAnswer(cleanMessage);

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    sendStreamEvent(res, "meta", { sessionId });

    if (fitnessKnowledgeAnswer) {
      sendStreamEvent(res, "chunk", { text: fitnessKnowledgeAnswer });
      await saveUserMessage(sessionId, userId, cleanMessage);
      await saveBotMessage(sessionId, userId, fitnessKnowledgeAnswer);
      sendStreamEvent(res, "done", { sessionId });
      return res.end();
    }

    const ollamaMessages = await buildOllamaMessages(sessionId, userId, cleanMessage);
    await saveUserMessage(sessionId, userId, cleanMessage);

    const startedAt = Date.now();
    let sentAnyChunk = false;
    const answer = await streamOllama(ollamaMessages, (chunk) => {
      sentAnyChunk = true;
      sendStreamEvent(res, "chunk", { text: chunk });
    });

    if (!sentAnyChunk && answer) {
      sendStreamEvent(res, "chunk", { text: answer });
    }

    console.info(`[chat] resposta Ollama stream gerada em ${Date.now() - startedAt}ms`);
    await saveBotMessage(sessionId, userId, answer);

    sendStreamEvent(res, "done", { sessionId });
    return res.end();
  } catch (error: any) {
    if (res.headersSent) {
      sendStreamEvent(res, "error", {
        message: "Erro ao conversar com o Ollama. Verifique se o Ollama está rodando.",
        detail: error?.message,
      });
      return res.end();
    }

    return res.status(500).json({
      success: false,
      message: "Erro ao conversar com o Ollama. Verifique se o Ollama está rodando.",
      detail: error?.message,
    });
  }
}

export async function chatHistory(req: Request, res: Response) {
  const { sessionId } = req.params;

  const messages = await ChatMessage.findAll({
    where: { sessionId },
    order: [["createdAt", "ASC"]],
  });

  return res.json({
    success: true,
    messages,
  });
}
