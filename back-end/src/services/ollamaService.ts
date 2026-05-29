import axios from "axios";

export type OllamaChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OllamaStreamHandler = (chunk: string) => void | Promise<void>;

function readNumberEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function buildOllamaPayload(messages: OllamaChatMessage[], stream: boolean) {
  const model = process.env.OLLAMA_MODEL || "llama3.2:1b";

  return {
    model,
    messages,
    stream,
    keep_alive: process.env.OLLAMA_KEEP_ALIVE || "10m",
    options: {
      temperature: Number(process.env.OLLAMA_TEMPERATURE || 0.45),
      top_p: Number(process.env.OLLAMA_TOP_P || 0.9),
      repeat_penalty: Number(process.env.OLLAMA_REPEAT_PENALTY || 1.15),
      num_predict: readNumberEnv("OLLAMA_NUM_PREDICT", 320),
      num_ctx: readNumberEnv("OLLAMA_NUM_CTX", 2048),
    },
  };
}

export async function askOllama(messages: OllamaChatMessage[]) {
  const baseURL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  const { data } = await axios.post(
    `${baseURL}/api/chat`,
    buildOllamaPayload(messages, false),
    {
      timeout: readNumberEnv("OLLAMA_TIMEOUT_MS", 120000),
    }
  );

  return data?.message?.content?.trim() || "Não consegui gerar uma resposta agora.";
}

export async function warmOllama(messages?: OllamaChatMessage[]) {
  const baseURL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const startedAt = Date.now();
  const payload = buildOllamaPayload(
    messages?.length
      ? messages
      : [
          {
            role: "user",
            content: "Responda apenas OK.",
          },
        ],
    false
  );

  await axios.post(
    `${baseURL}/api/chat`,
    {
      ...payload,
      options: {
        ...payload.options,
        temperature: 0,
        top_p: 1,
        num_predict: readNumberEnv("OLLAMA_WARMUP_NUM_PREDICT", 2),
      },
    },
    {
      timeout: readNumberEnv("OLLAMA_WARMUP_TIMEOUT_MS", 60000),
    }
  );

  return {
    model: payload.model,
    durationMs: Date.now() - startedAt,
  };
}

function parseOllamaLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

export async function streamOllama(
  messages: OllamaChatMessage[],
  onChunk: OllamaStreamHandler
) {
  const baseURL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  const { data } = await axios.post(
    `${baseURL}/api/chat`,
    buildOllamaPayload(messages, true),
    {
      responseType: "stream",
      timeout: readNumberEnv("OLLAMA_TIMEOUT_MS", 120000),
    }
  );

  let fullAnswer = "";
  let buffer = "";

  const handleLine = async (line: string) => {
    const parsed = parseOllamaLine(line);
    if (!parsed) return false;

    if (parsed.error) {
      throw new Error(parsed.error);
    }

    const chunk = parsed?.message?.content || "";
    if (chunk) {
      fullAnswer += chunk;
      await onChunk(chunk);
    }

    return Boolean(parsed.done);
  };

  for await (const rawChunk of data as AsyncIterable<Buffer | string>) {
    buffer += Buffer.isBuffer(rawChunk) ? rawChunk.toString("utf8") : rawChunk;

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const done = await handleLine(line);
      if (done) {
        return fullAnswer.trim() || "Não consegui gerar uma resposta agora.";
      }
    }
  }

  if (buffer) {
    await handleLine(buffer);
  }

  return fullAnswer.trim() || "Não consegui gerar uma resposta agora.";
}
