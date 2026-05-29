import { Op } from "sequelize";
import {
  ScheduleEvent,
  StudentCheckIn,
  StudentDietMeal,
  StudentDietPlan,
  StudentProfile,
  StudentWorkoutItem,
  StudentWorkoutSheet,
} from "../models";
import { classifyChatIntent, normalizeText } from "./chatIntent";

function getStartOfWeek() {
  const date = new Date();
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getEndOfWeek() {
  const date = getStartOfWeek();
  date.setDate(date.getDate() + 6);
  date.setHours(23, 59, 59, 999);
  return date;
}

function formatDateTime(value: unknown) {
  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value || "");
  }

  return date.toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function read(model: any, key: string) {
  return model?.getDataValue?.(key) ?? model?.[key] ?? null;
}

const dayKeys = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
const dayNames = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

function getTodayInfo() {
  const today = new Date();
  const dayIndex = today.getDay();

  return {
    date: today,
    key: dayKeys[dayIndex],
    name: dayNames[dayIndex],
  };
}

function appendSection(lines: string[], title: string, values: string[]) {
  const cleanValues = values.filter(Boolean);
  if (!cleanValues.length) return;

  lines.push(`\n${title}`);
  lines.push(...cleanValues);
}

export async function buildStudentDashboardContext(userId?: number | null) {
  if (!userId) {
    return "Usuário não logado. Não há painel individual, ficha, dieta ou agenda disponível.";
  }

  const startOfWeek = getStartOfWeek();
  const endOfWeek = getEndOfWeek();

  const [profile, dietPlan, workoutSheet, schedule, recentCheckins, weekCheckins, totalCheckins] =
    await Promise.all([
      StudentProfile.findOne({ where: { userId } }),
      StudentDietPlan.findOne({
        where: { userId, status: "active" },
        include: [{ model: StudentDietMeal, as: "meals" }],
      }),
      StudentWorkoutSheet.findOne({
        where: { userId, status: "active" },
        include: [{ model: StudentWorkoutItem, as: "items" }],
      }),
      ScheduleEvent.findAll({
        where: {
          userId,
          eventDate: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
        },
        order: [["eventDate", "ASC"]],
        limit: 7,
      }),
      StudentCheckIn.findAll({
        where: { userId },
        order: [["checkinDate", "DESC"]],
        limit: 5,
      }),
      StudentCheckIn.count({
        where: {
          userId,
          checkinDate: {
            [Op.between]: [
              startOfWeek.toISOString().slice(0, 10),
              endOfWeek.toISOString().slice(0, 10),
            ],
          },
        },
      }),
      StudentCheckIn.count({ where: { userId } }),
    ]);

  const lines = [
    "CONTEXTO DO PAINEL DO ALUNO LOGADO:",
    `Data de hoje: ${new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })}`,
    `Semana atual: ${startOfWeek.toLocaleDateString("pt-BR")} até ${endOfWeek.toLocaleDateString("pt-BR")}`,
  ];

  if (!profile && !dietPlan && !workoutSheet && !schedule.length) {
    lines.push("Painel individual ainda não gerado para este usuário.");
    return lines.join("\n");
  }

  if (profile) {
    const weeklyGoal = Number(read(profile, "weeklyGoal")) || 0;
    const pendingThisWeek = Math.max(weeklyGoal - weekCheckins, 0);

    appendSection(lines, "Perfil e meta:", [
      `- Objetivo: ${read(profile, "goal") || "não informado"}`,
      `- Nível: ${read(profile, "level") || "não informado"}`,
      `- Foco: ${read(profile, "focus") || "não informado"}`,
      `- Plano ativo: ${read(profile, "activePlanName") || "não informado"}`,
      `- Biotipo considerado: ${read(profile, "biotypeUsed") || "não informado"}`,
      `- Meta semanal: ${weeklyGoal || "não informada"} treinos`,
      `- Check-ins nesta semana: ${weekCheckins}`,
      `- Treinos pendentes nesta semana: ${pendingThisWeek}`,
      `- Check-ins totais: ${totalCheckins}`,
    ]);
  }

  if (workoutSheet) {
    const items = (read(workoutSheet, "items") || []) as any[];

    appendSection(lines, "Ficha de treino ativa:", [
      `- Título: ${read(workoutSheet, "title") || "não informado"}`,
      `- Foco: ${read(workoutSheet, "focus") || "não informado"}`,
      `- Descrição: ${read(workoutSheet, "description") || "não informada"}`,
      ...items.map(
        (item) =>
          `- ${read(item, "day")}: ${read(item, "name")} (${read(item, "type")}) - ${read(item, "sets") || "-"} séries / ${read(item, "reps") || "-"}`
      ),
    ]);
  }

  if (schedule.length) {
    appendSection(
      lines,
      "Agenda desta semana:",
      schedule.map(
        (event: any) =>
          `- ${formatDateTime(read(event, "eventDate"))}: ${read(event, "title")} (${read(event, "type")}, status: ${read(event, "status")})`
      )
    );
  }

  if (dietPlan) {
    const meals = (read(dietPlan, "meals") || []) as any[];

    appendSection(lines, "Plano alimentar ativo:", [
      `- Foco: ${read(dietPlan, "focus") || "não informado"}`,
      `- Kcal: ${read(dietPlan, "totalKcal") || "não informada"}`,
      `- Descrição: ${read(dietPlan, "description") || "não informada"}`,
      ...meals.map(
        (meal) =>
          `- ${read(meal, "time") || "sem horário"} - ${read(meal, "mealName")}: ${read(meal, "items")} (${read(meal, "kcal") || "kcal não informada"})`
      ),
    ]);
  }

  if (recentCheckins.length) {
    appendSection(
      lines,
      "Check-ins recentes:",
      recentCheckins.map(
        (checkin: any) =>
          `- ${read(checkin, "checkinDate")}: ${read(checkin, "workoutName")}${read(checkin, "notes") ? ` - notas: ${read(checkin, "notes")}` : ""}`
      )
    );
  }

  return lines.join("\n");
}

async function loadDashboardData(userId: number) {
  const startOfWeek = getStartOfWeek();
  const endOfWeek = getEndOfWeek();

  const [profile, dietPlan, workoutSheet, schedule, weekCheckins, totalCheckins] =
    await Promise.all([
      StudentProfile.findOne({ where: { userId } }),
      StudentDietPlan.findOne({
        where: { userId, status: "active" },
        include: [{ model: StudentDietMeal, as: "meals" }],
      }),
      StudentWorkoutSheet.findOne({
        where: { userId, status: "active" },
        include: [{ model: StudentWorkoutItem, as: "items" }],
      }),
      ScheduleEvent.findAll({
        where: {
          userId,
          eventDate: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
        },
        order: [["eventDate", "ASC"]],
        limit: 7,
      }),
      StudentCheckIn.count({
        where: {
          userId,
          checkinDate: {
            [Op.between]: [
              startOfWeek.toISOString().slice(0, 10),
              endOfWeek.toISOString().slice(0, 10),
            ],
          },
        },
      }),
      StudentCheckIn.count({ where: { userId } }),
    ]);

  return {
    startOfWeek,
    endOfWeek,
    profile,
    dietPlan,
    workoutSheet,
    schedule,
    weekCheckins,
    totalCheckins,
  };
}

function getWorkoutItems(workoutSheet: any) {
  return ((read(workoutSheet, "items") || []) as any[]).sort((a, b) => {
    return dayKeys.indexOf(read(a, "day")) - dayKeys.indexOf(read(b, "day"));
  });
}

function formatWorkoutItem(item: any) {
  return `${read(item, "day")}: ${read(item, "name")} (${read(item, "type")}) - ${read(item, "sets") || "-"} séries / ${read(item, "reps") || "-"}`;
}

function getMeals(dietPlan: any) {
  return (read(dietPlan, "meals") || []) as any[];
}

function formatMeal(meal: any) {
  return `${read(meal, "time") || "sem horário"} - ${read(meal, "mealName")}: ${read(meal, "items")}`;
}

function findPreWorkoutMeal(dietPlan: any) {
  const meals = getMeals(dietPlan);
  return (
    meals.find((meal) => normalizeText(String(read(meal, "mealName") || "")).includes("pre")) ||
    meals.find((meal) => String(read(meal, "time") || "").startsWith("16"))
  );
}

function buildRoutineAnswer(workoutSheet: any) {
  const items = getWorkoutItems(workoutSheet);

  if (!items.length) {
    return "Não encontrei uma ficha ativa no seu painel para montar a rotina.";
  }

  return [
    "Sua rotina planejada no painel está assim:",
    ...items.map((item) => `- ${formatWorkoutItem(item)}`),
  ].join("\n");
}

function buildTodayAnswer(workoutSheet: any, dietPlan: any) {
  const today = getTodayInfo();
  const items = getWorkoutItems(workoutSheet);
  const todayWorkout = items.find((item) => read(item, "day") === today.key);
  const preWorkoutMeal = findPreWorkoutMeal(dietPlan);
  const lines = [`Hoje é ${today.name} (${today.key}).`];

  if (todayWorkout) {
    lines.push(`Pela sua ficha, o treino de hoje é: ${formatWorkoutItem(todayWorkout)}.`);
  } else {
    lines.push("Não encontrei treino cadastrado para hoje na sua ficha ativa.");
  }

  if (preWorkoutMeal) {
    lines.push(`Pré-treino do seu plano alimentar: ${formatMeal(preWorkoutMeal)}.`);
  }

  lines.push("Use essa base do painel e ajuste carga/intensidade conforme energia e segurança na execução.");

  return lines.join("\n");
}

function buildLightTodayAnswer(workoutSheet: any, dietPlan: any) {
  const today = getTodayInfo();
  const items = getWorkoutItems(workoutSheet);
  const todayWorkout = items.find((item) => read(item, "day") === today.key);
  const preWorkoutMeal = findPreWorkoutMeal(dietPlan);
  const lines = [
    "Fechado. Se hoje você está sem ânimo, vamos fazer uma versão leve e possível, sem abandonar a rotina.",
  ];

  if (todayWorkout) {
    lines.push(`Pelo seu painel, hoje é ${today.key}: ${read(todayWorkout, "name")} (${read(todayWorkout, "type")}).`);
    lines.push("Sugestão leve: aqueça 5-8 min, faça 2-3 séries por exercício com carga confortável, sem ir até a falha, e finalize com alongamento leve.");
  } else {
    lines.push("Não encontrei treino cadastrado para hoje na sua ficha ativa, então faça 20-30 min de caminhada leve, mobilidade ou um full body bem tranquilo.");
  }

  if (preWorkoutMeal) {
    lines.push(`Se for treinar, mantenha o pré-treino do painel: ${formatMeal(preWorkoutMeal)}.`);
  }

  lines.push("O objetivo de hoje é aparecer e sair melhor do que entrou, não bater recorde.");

  return lines.join("\n");
}

function buildDietAnswer(dietPlan: any, wantsPreWorkout: boolean) {
  if (!dietPlan) {
    return "Não encontrei um plano alimentar ativo no seu painel.";
  }

  if (wantsPreWorkout) {
    const preWorkoutMeal = findPreWorkoutMeal(dietPlan);

    if (!preWorkoutMeal) {
      return "Não encontrei uma refeição de pré-treino cadastrada no seu plano alimentar.";
    }

    return `No seu plano alimentar, o pré-treino está assim: ${formatMeal(preWorkoutMeal)}.`;
  }

  const meals = getMeals(dietPlan);
  return [
    `Seu plano alimentar ativo tem foco em ${read(dietPlan, "focus")}.`,
    ...meals.map((meal) => `- ${formatMeal(meal)}`),
  ].join("\n");
}

function buildGoalAnswer(profile: any, weekCheckins: number, totalCheckins: number) {
  if (!profile) {
    return "Não encontrei perfil/metas do aluno no painel.";
  }

  const weeklyGoal = Number(read(profile, "weeklyGoal")) || 0;
  const pendingThisWeek = Math.max(weeklyGoal - weekCheckins, 0);

  return [
    `Sua meta semanal é de ${weeklyGoal} treinos.`,
    `Nesta semana você registrou ${weekCheckins} check-in(s), então faltam ${pendingThisWeek} treino(s) para bater a meta.`,
    `Check-ins totais no painel: ${totalCheckins}.`,
  ].join("\n");
}

export async function buildDashboardDirectAnswer(userId: number | null, message: string) {
  const intent = classifyChatIntent(message);

  if (!userId) {
    if (
      !intent.asksPersonalData &&
      !(intent.normalized.includes("hoje") && intent.mentionsTraining)
    ) {
      return null;
    }

    return "Não tenho acesso ao seu painel porque você não está logado nesta conversa. Faça login ou gere seu painel para eu responder com seu treino, rotina e dieta reais.";
  }

  if (
    !intent.isLightTrainingQuestion &&
    !intent.isTodayQuestion &&
    !intent.isDietQuestion &&
    !intent.isGoalQuestion &&
    !intent.isRoutineQuestion
  ) {
    return null;
  }

  const { profile, dietPlan, workoutSheet, weekCheckins, totalCheckins } =
    await loadDashboardData(userId);

  if (!profile && !dietPlan && !workoutSheet) {
    return "Seu painel individual ainda não foi gerado. Faça o teste de biotipo ou atualize o painel para eu usar sua ficha, rotina e dieta reais.";
  }

  if (intent.isGoalQuestion) {
    return buildGoalAnswer(profile, weekCheckins, totalCheckins);
  }

  if (intent.isDietQuestion && !intent.isTodayQuestion) {
    return buildDietAnswer(dietPlan, intent.wantsPreWorkout);
  }

  if (intent.isLightTrainingQuestion) {
    return buildLightTodayAnswer(workoutSheet, dietPlan);
  }

  if (intent.isTodayQuestion) {
    return buildTodayAnswer(workoutSheet, dietPlan);
  }

  if (intent.isRoutineQuestion) {
    return buildRoutineAnswer(workoutSheet);
  }

  return null;
}
