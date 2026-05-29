export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function classifyChatIntent(message: string) {
  const normalized = normalizeText(message);
  const compact = normalized.replace(/[^\w\s]/g, "").trim();

  const asksPersonalData =
    /\b(meu|minha|meus|minhas|painel|rotina|ficha|dieta|meta|checkin|check-ins)\b/.test(
      normalized
    );
  const feelsLowEnergy =
    normalized.includes("sem animo") ||
    normalized.includes("desanimado") ||
    normalized.includes("desanimada") ||
    normalized.includes("cansado") ||
    normalized.includes("cansada") ||
    normalized.includes("leve") ||
    normalized.includes("tranquilo") ||
    normalized.includes("tranquila");
  const mentionsTraining =
    normalized.includes("treino") ||
    normalized.includes("treinar") ||
    normalized.includes("exercicio") ||
    normalized.includes("academia");

  const isGreeting =
    /^(oi|ola|opa|e ai|bom dia|boa tarde|boa noite)\b/.test(compact) ||
    compact === "tudo bem" ||
    compact === "oi tudo bem" ||
    compact === "ola tudo bem";
  const tokenCount = compact ? compact.split(/\s+/).length : 0;
  const isLowSignal =
    compact === "teste" ||
    compact === "testando" ||
    compact === "resposta" ||
    compact === "responda" ||
    compact === "?" ||
    compact === "??" ||
    (tokenCount <= 2 &&
      !isGreeting &&
      !asksPersonalData &&
      !mentionsTraining &&
      !normalized.includes("dieta") &&
      !normalized.includes("meta") &&
      !normalized.includes("descanso") &&
      !normalized.includes("anabolizante"));

  const asksMemory =
    normalized.includes("lembra") ||
    normalized.includes("o que eu falei") ||
    normalized.includes("que eu falei") ||
    normalized.includes("falei agora");

  const wantsMotivation =
    normalized.includes("animando") ||
    normalized.includes("me anima") ||
    normalized.includes("motivando") ||
    normalized.includes("motivacao") ||
    normalized.includes("motivação");

  const wantsPreWorkout =
    normalized.includes("pre-treino") ||
    normalized.includes("pre treino") ||
    normalized.includes("antes do treino");

  return {
    normalized,
    compact,
    asksPersonalData,
    asksMemory,
    asksRestBetweenSets:
      (normalized.includes("descanso") || normalized.includes("intervalo")) &&
      (normalized.includes("serie") || normalized.includes("series")),
    asksMedication:
      normalized.includes("anabolizante") ||
      normalized.includes("esteroide") ||
      normalized.includes("hormonio") ||
      normalized.includes("hormonios") ||
      normalized.includes("medicamento") ||
      normalized.includes("remedio"),
    asksPainOrInjury:
      normalized.includes("dor forte") ||
      normalized.includes("lesao") ||
      normalized.includes("machuquei") ||
      normalized.includes("machucado") ||
      normalized.includes("gravidez") ||
      normalized.includes("problema medico"),
    feelsLowEnergy,
    isDietQuestion:
      normalized.includes("dieta") ||
      normalized.includes("comer") ||
      normalized.includes("refeicao") ||
      wantsPreWorkout,
    isGoalQuestion:
      normalized.includes("meta") ||
      normalized.includes("faltam") ||
      normalized.includes("checkin") ||
      normalized.includes("check-ins"),
    isGreeting,
    isLowSignal,
    isLightTrainingQuestion: feelsLowEnergy && mentionsTraining,
    isRoutineQuestion:
      normalized.includes("rotina") ||
      normalized.includes("ficha") ||
      normalized.includes("meu treino") ||
      normalized.includes("treino de hoje"),
    isTodayQuestion:
      normalized.includes("treino de hoje") ||
      normalized.includes("treinar hoje") ||
      (normalized.includes("hoje") && asksPersonalData && mentionsTraining),
    mentionsTraining,
    wantsMotivation,
    wantsPreWorkout,
  };
}
