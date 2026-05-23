import axios from "axios";

export type OllamaChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function askOllama(messages: OllamaChatMessage[]) {
  const baseURL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2:1b";

  const { data } = await axios.post(
    `${baseURL}/api/chat`,
    {
      model,
      messages,
      stream: false,
      options: {
        temperature: 0.45,
        top_p: 0.9,
        repeat_penalty: 1.15,
        num_predict: 650,
      },
    },
    {
      timeout: 120000,
    }
  );

  return data?.message?.content?.trim() || "Não consegui gerar uma resposta agora.";
}