import { Request, Response } from "express";
import { Op } from "sequelize";
import {
  StudentProfile,
  StudentDietPlan,
  StudentDietMeal,
  StudentWorkoutSheet,
  StudentWorkoutItem,
  StudentCheckIn,
  ScheduleEvent,
} from "../models";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

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

function addDays(days: number, hour = 18) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function normalizeBiotype(biotype?: string | null) {
  return String(biotype || "padrao")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getTemplateByBiotype(biotype?: string | null) {
  const type = normalizeBiotype(biotype);

  if (type.includes("ecto")) {
    return {
      profile: {
        goal: "Hipertrofia",
        level: "Iniciante",
        weeklyGoal: 4,
        focus: "Ganho de massa",
        activePlanName: "Hipertrofia base",
      },
      diet: {
        focus: "Ganho de massa",
        totalKcal: "Ajustável",
        description:
          "Plano alimentar com foco em consistência, proteína distribuída ao longo do dia e boas fontes de carboidrato.",
        meals: [
          {
            mealName: "Café da manhã",
            time: "07:30",
            items: "Ovos ou iogurte, fruta e pão integral ou aveia.",
            kcal: "Ajustável",
          },
          {
            mealName: "Almoço",
            time: "12:30",
            items: "Arroz ou batata, feijão, frango/carne/ovo e salada.",
            kcal: "Ajustável",
          },
          {
            mealName: "Pré-treino",
            time: "16:30",
            items: "Banana com aveia ou pão com uma fonte de proteína.",
            kcal: "Ajustável",
          },
          {
            mealName: "Jantar",
            time: "20:00",
            items: "Proteína, carboidrato e legumes.",
            kcal: "Ajustável",
          },
        ],
      },
      workout: {
        title: "Ficha da semana",
        focus: "Hipertrofia",
        description:
          "Treino com foco em progressão de carga, boa execução e descanso adequado.",
        items: [
          { day: "SEG", name: "Peito + Tríceps", type: "Musculação", sets: "3-4", reps: "8-12" },
          { day: "TER", name: "Costas + Bíceps", type: "Musculação", sets: "3-4", reps: "8-12" },
          { day: "QUA", name: "Descanso ativo", type: "Mobilidade", sets: "-", reps: "20 min" },
          { day: "QUI", name: "Pernas completas", type: "Musculação", sets: "3-4", reps: "8-12" },
          { day: "SEX", name: "Ombros + Abdômen", type: "Musculação", sets: "3", reps: "10-15" },
        ],
      },
    };
  }

  if (type.includes("endo")) {
    return {
      profile: {
        goal: "Emagrecimento",
        level: "Iniciante",
        weeklyGoal: 4,
        focus: "Condicionamento e constância",
        activePlanName: "Emagrecimento com força",
      },
      diet: {
        focus: "Controle de rotina",
        totalKcal: "Ajustável",
        description:
          "Plano alimentar com foco em organização das refeições, hidratação e redução de excessos.",
        meals: [
          {
            mealName: "Café da manhã",
            time: "07:30",
            items: "Proteína, fruta e uma fonte leve de carboidrato.",
            kcal: "Ajustável",
          },
          {
            mealName: "Almoço",
            time: "12:30",
            items: "Proteína, legumes, salada, arroz/batata em porção moderada.",
            kcal: "Ajustável",
          },
          {
            mealName: "Lanche",
            time: "16:30",
            items: "Iogurte, fruta ou sanduíche simples com proteína.",
            kcal: "Ajustável",
          },
          {
            mealName: "Jantar",
            time: "20:00",
            items: "Proteína, legumes e carboidrato conforme fome e rotina.",
            kcal: "Ajustável",
          },
        ],
      },
      workout: {
        title: "Ficha da semana",
        focus: "Força + cardio",
        description:
          "Treino combinando musculação com cardio leve/moderado para melhorar condicionamento.",
        items: [
          { day: "SEG", name: "Full body A", type: "Musculação", sets: "3", reps: "10-12" },
          { day: "TER", name: "Cardio leve", type: "Cardio", sets: "-", reps: "25-35 min" },
          { day: "QUA", name: "Full body B", type: "Musculação", sets: "3", reps: "10-12" },
          { day: "QUI", name: "Mobilidade", type: "Recuperação", sets: "-", reps: "20 min" },
          { day: "SEX", name: "Full body C + HIIT curto", type: "Misto", sets: "3", reps: "10-12" },
        ],
      },
    };
  }

  return {
    profile: {
      goal: "Definição",
      level: "Intermediário",
      weeklyGoal: 5,
      focus: "Força e condicionamento",
      activePlanName: "Definição equilibrada",
    },
    diet: {
      focus: "Equilíbrio alimentar",
      totalKcal: "Ajustável",
      description:
        "Plano alimentar com equilíbrio entre proteína, carboidratos e rotina sustentável.",
      meals: [
        {
          mealName: "Café da manhã",
          time: "07:30",
          items: "Ovos ou iogurte, fruta e aveia ou pão integral.",
          kcal: "Ajustável",
        },
        {
          mealName: "Almoço",
          time: "12:30",
          items: "Proteína, arroz/batata, feijão e salada.",
          kcal: "Ajustável",
        },
        {
          mealName: "Pré-treino",
          time: "16:30",
          items: "Carboidrato leve com proteína.",
          kcal: "Ajustável",
        },
        {
          mealName: "Jantar",
          time: "20:00",
          items: "Proteína, legumes e carboidrato conforme objetivo.",
          kcal: "Ajustável",
        },
      ],
    },
    workout: {
      title: "Ficha da semana",
      focus: "Definição",
      description:
        "Treino com musculação, cardio controlado e progressão semanal.",
      items: [
        { day: "SEG", name: "Superiores", type: "Musculação", sets: "3-4", reps: "8-12" },
        { day: "TER", name: "Inferiores", type: "Musculação", sets: "3-4", reps: "8-12" },
        { day: "QUA", name: "Cardio + Core", type: "Cardio", sets: "-", reps: "25 min" },
        { day: "QUI", name: "Costas + Bíceps", type: "Musculação", sets: "3-4", reps: "8-12" },
        { day: "SEX", name: "Pernas + Ombros", type: "Musculação", sets: "3-4", reps: "8-12" },
      ],
    },
  };
}

async function createScheduleFromWorkout(userId: number, items: any[]) {
  await ScheduleEvent.destroy({ where: { userId } });

  const daysMap: Record<string, number> = {
    SEG: 1,
    TER: 2,
    QUA: 3,
    QUI: 4,
    SEX: 5,
    SAB: 6,
    DOM: 7,
  };

  const start = getStartOfWeek();

  for (const item of items) {
    const dayOffset = daysMap[item.day] ? daysMap[item.day] - 1 : 0;
    const eventDate = new Date(start);
    eventDate.setDate(start.getDate() + dayOffset);
    eventDate.setHours(18, 0, 0, 0);

    await ScheduleEvent.create({
      userId,
      title: item.name,
      eventDate,
      type: item.type,
      status: "scheduled",
    });
  }
}

async function ensureDashboardData(userId: number, biotype?: string | null) {
  const template = getTemplateByBiotype(biotype);

  const [profile] = await StudentProfile.findOrCreate({
    where: { userId },
    defaults: {
      userId,
      ...template.profile,
      biotypeUsed: biotype || "Padrão",
    },
  });

  await profile.update({
    ...template.profile,
    biotypeUsed: biotype || profile.getDataValue("biotypeUsed") || "Padrão",
  });

  await StudentDietPlan.destroy({ where: { userId } });
  await StudentWorkoutSheet.destroy({ where: { userId } });

  const dietPlan = await StudentDietPlan.create({
    userId,
    focus: template.diet.focus,
    totalKcal: template.diet.totalKcal,
    description: template.diet.description,
    status: "active",
  });

  for (const meal of template.diet.meals) {
    await StudentDietMeal.create({
      dietPlanId: dietPlan.getDataValue("id"),
      ...meal,
    });
  }

  const workoutSheet = await StudentWorkoutSheet.create({
    userId,
    title: template.workout.title,
    focus: template.workout.focus,
    description: template.workout.description,
    status: "active",
  });

  for (const item of template.workout.items) {
    await StudentWorkoutItem.create({
      sheetId: workoutSheet.getDataValue("id"),
      ...item,
    });
  }

  await createScheduleFromWorkout(userId, template.workout.items);

  return profile;
}

export async function saveBiotype(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);
    const { biotype } = req.body;

    if (!userId || !biotype) {
      return res.status(400).json({
        success: false,
        message: "userId e biotype são obrigatórios.",
      });
    }

    await ensureDashboardData(userId, biotype);

    return res.json({
      success: true,
      message: "Biotipo salvo e painel atualizado com sucesso.",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Erro ao salvar biotipo.",
      detail: error.message,
    });
  }
}

export async function getStudentDashboard(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId inválido.",
      });
    }

    let profile = await StudentProfile.findOne({ where: { userId } });

    if (!profile) {
      profile = await ensureDashboardData(userId, "Padrão");
    }

    const dietPlan = await StudentDietPlan.findOne({
      where: { userId, status: "active" },
      include: [{ model: StudentDietMeal, as: "meals" }],
    });

    const workoutSheet = await StudentWorkoutSheet.findOne({
      where: { userId, status: "active" },
      include: [{ model: StudentWorkoutItem, as: "items" }],
    });

    const schedule = await ScheduleEvent.findAll({
      where: {
        userId,
        eventDate: {
          [Op.between]: [getStartOfWeek(), getEndOfWeek()],
        },
      },
      order: [["eventDate", "ASC"]],
    });

    const weekCheckins = await StudentCheckIn.count({
      where: {
        userId,
        checkinDate: {
          [Op.between]: [
            getStartOfWeek().toISOString().slice(0, 10),
            getEndOfWeek().toISOString().slice(0, 10),
          ],
        },
      },
    });

    const totalCheckins = await StudentCheckIn.count({ where: { userId } });

    const weeklyGoal = Number(profile.getDataValue("weeklyGoal")) || 4;
    const evolution = Math.min(Math.round((weekCheckins / weeklyGoal) * 100), 100);

    return res.json({
      success: true,
      profile,
      dietPlan,
      workoutSheet,
      schedule,
      summary: {
        currentWeek: `${getStartOfWeek().toLocaleDateString("pt-BR")} até ${getEndOfWeek().toLocaleDateString("pt-BR")}`,
        completedThisWeek: weekCheckins,
        weeklyGoal,
        pendingThisWeek: Math.max(weeklyGoal - weekCheckins, 0),
      },
      metrics: {
        completedWorkouts: totalCheckins,
        weeklyGoal,
        evolution,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar painel do aluno.",
      detail: error.message,
    });
  }
}

export async function createCheckIn(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);
    const { workoutName, notes } = req.body;

    if (!userId || !workoutName) {
      return res.status(400).json({
        success: false,
        message: "userId e workoutName são obrigatórios.",
      });
    }

    const checkinDate = todayISO();

    const alreadyChecked = await StudentCheckIn.findOne({
      where: {
        userId,
        workoutName,
        checkinDate,
      },
    });

    if (alreadyChecked) {
      return res.status(409).json({
        success: false,
        message: "Esse treino já foi marcado como concluído hoje.",
      });
    }

    const checkin = await StudentCheckIn.create({
      userId,
      workoutName,
      checkinDate,
      notes: notes || null,
    });

    await ScheduleEvent.update(
      { status: "completed" },
      {
        where: {
          userId,
          title: workoutName,
          eventDate: {
            [Op.between]: [new Date(`${checkinDate}T00:00:00`), new Date(`${checkinDate}T23:59:59`)],
          },
        },
      }
    );

    return res.status(201).json({
      success: true,
      message: "Check-in registrado com sucesso.",
      checkin,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Erro ao registrar check-in.",
      detail: error.message,
    });
  }
}