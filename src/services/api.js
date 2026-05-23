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