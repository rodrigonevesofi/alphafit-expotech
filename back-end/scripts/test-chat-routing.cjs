process.env.DATABASE_STORAGE = ":memory:";
process.env.JWT_SECRET = "alphafit_test_secret";

const assert = require("node:assert/strict");
const { sequelize } = require("../dist/config/database");
const {
  ScheduleEvent,
  StudentCheckIn,
  StudentDietMeal,
  StudentDietPlan,
  StudentProfile,
  StudentWorkoutItem,
  StudentWorkoutSheet,
  User,
} = require("../dist/models");
const { classifyChatIntent } = require("../dist/services/chatIntent");
const {
  buildConversationMemoryAnswer,
  buildFitnessKnowledgeAnswer,
} = require("../dist/services/fitnessKnowledge");
const { buildDashboardDirectAnswer } = require("../dist/services/studentContext");

const TEST_USER_ID = 99;
const dayKeys = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function assertIncludes(value, expected, label) {
  assert.match(value, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), label);
}

async function seedDashboardFixture() {
  await sequelize.sync({ force: true });

  await User.create({
    id: TEST_USER_ID,
    name: "Aluno Teste",
    email: "aluno.teste@alphafit.com",
    phone: "11900000000",
    password: "hash-test",
    role: "student",
    biotype: "mesomorfo",
  });

  await StudentProfile.create({
    userId: TEST_USER_ID,
    goal: "Definição",
    level: "Intermediário",
    weeklyGoal: 4,
    focus: "Força e condicionamento",
    activePlanName: "Plano Teste",
    biotypeUsed: "Mesomorfo",
  });

  const dietPlan = await StudentDietPlan.create({
    userId: TEST_USER_ID,
    focus: "Equilíbrio alimentar",
    totalKcal: "Ajustável",
    description: "Plano alimentar de teste.",
    status: "active",
  });

  await StudentDietMeal.bulkCreate([
    {
      dietPlanId: dietPlan.getDataValue("id"),
      mealName: "Café da manhã",
      time: "07:30",
      items: "Ovos, fruta e aveia.",
      kcal: "Ajustável",
    },
    {
      dietPlanId: dietPlan.getDataValue("id"),
      mealName: "Pré-treino",
      time: "16:30",
      items: "Banana com aveia e iogurte.",
      kcal: "Ajustável",
    },
  ]);

  const workoutSheet = await StudentWorkoutSheet.create({
    userId: TEST_USER_ID,
    title: "Ficha Teste",
    focus: "Definição",
    description: "Ficha de teste automatizado.",
    status: "active",
  });

  const todayKey = dayKeys[new Date().getDay()];

  await StudentWorkoutItem.bulkCreate([
    {
      sheetId: workoutSheet.getDataValue("id"),
      day: todayKey,
      name: "Treino Teste do Dia",
      type: "Musculação",
      sets: "2-3",
      reps: "10-12",
    },
    {
      sheetId: workoutSheet.getDataValue("id"),
      day: "SEX",
      name: "Treino Complementar",
      type: "Cardio",
      sets: "-",
      reps: "25 min",
    },
  ]);

  await StudentCheckIn.create({
    userId: TEST_USER_ID,
    workoutName: "Treino anterior",
    checkinDate: todayISO(),
    notes: "Check-in de teste.",
  });

  await ScheduleEvent.create({
    userId: TEST_USER_ID,
    title: "Treino Teste do Dia",
    eventDate: new Date(),
    type: "Musculação",
    status: "scheduled",
  });

  return { todayKey };
}

async function run() {
  const { todayKey } = await seedDashboardFixture();

  assert.equal(classifyChatIntent("Oi, tudo bem?").isGreeting, true);
  assert.equal(
    classifyChatIntent("Estou sem animo hoje, quero treinar algo leve.").isLightTrainingQuestion,
    true
  );
  assert.equal(classifyChatIntent("Qual descanso entre series?").asksRestBetweenSets, true);

  assertIncludes(buildFitnessKnowledgeAnswer("Oi, tudo bem?"), "Oi!", "saudação");
  assertIncludes(buildFitnessKnowledgeAnswer("teste"), "Estou online", "mensagem de teste");
  assertIncludes(buildFitnessKnowledgeAnswer("resposta?"), "pergunta mais específica", "mensagem vaga");
  assertIncludes(
    buildFitnessKnowledgeAnswer("Qual descanso entre series para hipertrofia?"),
    "60 a 120 segundos",
    "descanso hipertrofia"
  );
  assertIncludes(
    buildFitnessKnowledgeAnswer("Posso tomar anabolizante?"),
    "Não posso prescrever",
    "segurança medicamento"
  );

  assertIncludes(
    buildConversationMemoryAnswer("Você lembra o que eu falei?", "quero treinar leve"),
    "quero treinar leve",
    "memória da conversa"
  );

  const guestAnswer = await buildDashboardDirectAnswer(null, "Qual é meu treino de hoje?");
  assertIncludes(guestAnswer, "não está logado", "usuário guest");

  const todayAnswer = await buildDashboardDirectAnswer(TEST_USER_ID, "Qual é meu treino de hoje?");
  assertIncludes(todayAnswer, todayKey, "dia da ficha");
  assertIncludes(todayAnswer, "Treino Teste do Dia", "treino do dia");
  assertIncludes(todayAnswer, "Banana com aveia", "pré-treino do painel");

  const lightAnswer = await buildDashboardDirectAnswer(
    TEST_USER_ID,
    "Estou sem animo hoje, quero treinar algo leve."
  );
  assertIncludes(lightAnswer, "versão leve", "treino leve");
  assertIncludes(lightAnswer, "Treino Teste do Dia", "treino leve usa painel");

  const dietAnswer = await buildDashboardDirectAnswer(
    TEST_USER_ID,
    "O que comer no pre-treino?"
  );
  assertIncludes(dietAnswer, "16:30", "horário pré-treino");
  assertIncludes(dietAnswer, "Banana com aveia", "itens pré-treino");

  const goalAnswer = await buildDashboardDirectAnswer(
    TEST_USER_ID,
    "Quantos treinos faltam para bater minha meta semanal?"
  );
  assertIncludes(goalAnswer, "meta semanal", "meta semanal");
  assertIncludes(goalAnswer, "faltam 3", "treinos pendentes");

  const routineAnswer = await buildDashboardDirectAnswer(
    TEST_USER_ID,
    "Qual minha rotina completa da semana?"
  );
  assertIncludes(routineAnswer, "Treino Teste do Dia", "rotina treino atual");
  assertIncludes(routineAnswer, "Treino Complementar", "rotina treino complementar");

  await sequelize.close();
  console.log("Chat routing tests passed.");
}

run().catch(async (error) => {
  console.error(error);
  await sequelize.close();
  process.exit(1);
});
