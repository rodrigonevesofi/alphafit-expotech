const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

function getToken() {
  return localStorage.getItem("pulsefitToken");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// Auth
export async function apiLogin(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}

export async function apiRegister(name, email, phone, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, password }),
  });

  return res.json();
}

// Users admin
export async function apiListUsers() {
  const res = await fetch(`${BASE_URL}/auth/users`, {
    headers: authHeaders(),
  });

  return res.json();
}

export async function apiCreateUser(data) {
  const res = await fetch(`${BASE_URL}/auth/users`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function apiUpdateUser(id, data) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function apiDeleteUser(id) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return res.json();
}

// Chat
export async function apiSendChatMessage(message, sessionId = "alphafit-chat", userId = null) {
  const res = await fetch(`${BASE_URL}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId, userId }),
  });

  return res.json();
}

async function readApiError(res) {
  try {
    const data = await res.json();
    return data?.message || "Erro ao conversar com o AlphaBot.";
  } catch {
    return "Erro ao conversar com o AlphaBot.";
  }
}

function dispatchChatStreamEvent(block, handlers) {
  const lines = block.split(/\r?\n/);
  let event = "message";
  const dataLines = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  if (!dataLines.length) return null;

  let payload = {};

  try {
    payload = JSON.parse(dataLines.join("\n"));
  } catch {
    return null;
  }

  if (event === "chunk") {
    handlers.onChunk?.(payload.text || "");
    return null;
  }

  if (event === "done") {
    handlers.onDone?.(payload);
    return null;
  }

  if (event === "error") {
    const error = new Error(payload.message || "Erro ao conversar com o AlphaBot.");
    error.detail = payload.detail;
    error.fallbackAllowed = false;
    handlers.onError?.(error);
    return error;
  }

  handlers.onMeta?.(payload);
  return null;
}

function readPositiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function apiStreamChatMessage(
  message,
  sessionId = "alphafit-chat",
  userId = null,
  handlers = {}
) {
  const controller = new AbortController();
  const timeoutMs = readPositiveNumber(import.meta.env.VITE_CHAT_TIMEOUT_MS, 120000);
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  let streamedText = "";

  function dispatchChatStreamEventWithTracking(block, handlers) {
    const error = dispatchChatStreamEvent(block, {
      ...handlers,
      onChunk: (chunk) => {
        streamedText += chunk || "";
        handlers.onChunk?.(chunk);
      },
    });

    return error;
  }

  try {
    const res = await fetch(`${BASE_URL}/chat/message/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId, userId }),
      signal: controller.signal,
    });

    if (!res.ok || !res.body) {
      throw new Error(await readApiError(res));
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split(/\n\n/);
      buffer = blocks.pop() || "";

      for (const block of blocks) {
        const error = dispatchChatStreamEventWithTracking(block, handlers);
        if (error) throw error;
      }
    }

    buffer += decoder.decode();

    if (buffer.trim()) {
      const error = dispatchChatStreamEventWithTracking(buffer, handlers);
      if (error) throw error;
    }

    if (!streamedText.trim()) {
      throw new Error("O stream não retornou texto. Tentando método de fallback.");
    }

    return { success: true };
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error(
        "O AlphaBot demorou demais para responder. Tente uma pergunta mais direta ou verifique o Ollama."
      );
      timeoutError.fallbackAllowed = false;
      throw timeoutError;
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

// Painel do aluno
export async function apiGetStudentDashboard(userId) {
  const res = await fetch(`${BASE_URL}/student-dashboard/${userId}`, {
    headers: authHeaders(),
  });

  return res.json();
}

export async function apiSaveStudentBiotype(userId, biotype) {
  const res = await fetch(`${BASE_URL}/student-dashboard/${userId}/biotype`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ biotype }),
  });

  return res.json();
}

export async function apiCreateWorkoutCheckIn(userId, workoutName, notes = "") {
  const res = await fetch(`${BASE_URL}/student-dashboard/${userId}/checkin`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ workoutName, notes }),
  });

  return res.json();
}
