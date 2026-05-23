import { Request, Response } from "express";
import { ChatMessage, User } from "../models";
import { askOllama, OllamaChatMessage } from "../services/ollamaService";
import { buildSystemPrompt, buildUserProfile } from "../services/alphaPrompt";

function mapHistoryToOllamaMessages(historyRows: any[]): OllamaChatMessage[] {
  return historyRows
    .filter((row: any) => row?.message)
    .map((row: any) => ({
      role: row.sender === "user" ? "user" : "assistant",
      content: String(row.message),
    }));
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const { message, sessionId = "default", userId = null } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: "Mensagem obrigatória.",
      });
    }

    const cleanMessage = String(message).trim();

    const historyRowsDesc = await ChatMessage.findAll({
      where: { sessionId },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    const historyRows = historyRowsDesc.reverse();

    const user = userId ? await User.findByPk(userId) : null;
    const userProfile = buildUserProfile(user as any);

    const ollamaMessages: OllamaChatMessage[] = [
      {
        role: "system",
        content: buildSystemPrompt(userProfile),
      },
      ...mapHistoryToOllamaMessages(historyRows),
      {
        role: "user",
        content: cleanMessage,
      },
    ];

    await ChatMessage.create({
      sessionId,
      userId,
      sender: "user",
      message: cleanMessage,
    });

    const answer = await askOllama(ollamaMessages);

    await ChatMessage.create({
      sessionId,
      userId,
      sender: "bot",
      message: answer,
    });

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