import { classifyChatIntent } from "./chatIntent";

export function buildConversationMemoryAnswer(message: string, lastUserMessage?: string | null) {
  const intent = classifyChatIntent(message);

  if (!intent.asksMemory) return null;

  if (!lastUserMessage) {
    return "Ainda não tenho uma mensagem anterior nesta conversa para lembrar. Me conta de novo e eu sigo com você.";
  }

  if (intent.wantsMotivation) {
    return [
      `Lembro sim: você comentou "${lastUserMessage}".`,
      "Então vamos no modo possível: faz uma versão leve, sem buscar recorde, só para manter o compromisso com você.",
      "Começa pequeno, aquece, faz o básico com boa execução e sai da academia com a sensação de missão cumprida.",
    ].join("\n");
  }

  return `Lembro sim: você comentou "${lastUserMessage}".`;
}

export function buildFitnessKnowledgeAnswer(message: string) {
  const intent = classifyChatIntent(message);

  if (intent.isGreeting) {
    return "Oi! Tudo bem por aqui. Me conta como você está hoje: quer falar de treino, dieta, rotina ou só ajustar o treino do dia?";
  }

  if (intent.isLowSignal) {
    return "Estou online e pronto para te ajudar. Me manda uma pergunta mais específica, por exemplo: meu treino de hoje, minha dieta, treino leve ou descanso entre séries.";
  }

  if (intent.asksRestBetweenSets) {
    return [
      "Para descanso entre séries, use esta base:",
      "- Hipertrofia: 60 a 120 segundos na maioria dos exercícios.",
      "- Força/cargas altas: 2 a 3 minutos, podendo chegar a 5 minutos em exercícios muito pesados.",
      "- Resistência/condicionamento: 30 a 60 segundos.",
      "Se a execução começar a piorar, aumente um pouco o descanso antes de subir a carga.",
    ].join("\n");
  }

  if (intent.asksMedication) {
    return [
      "Não posso prescrever ou orientar uso de anabolizantes, hormônios, medicamentos ou doses.",
      "Para performance e saúde, foque em treino progressivo, sono, alimentação e acompanhamento profissional.",
      "Se você está pensando em usar algo desse tipo, converse com um médico ou nutricionista esportivo habilitado.",
    ].join("\n");
  }

  if (intent.asksPainOrInjury) {
    return [
      "Se há dor forte, lesão, gravidez ou restrição médica, o mais seguro é pausar o exercício que incomoda e procurar um profissional de saúde.",
      "Posso ajudar a adaptar a rotina de forma leve, mas não substituo avaliação médica ou fisioterapêutica.",
    ].join("\n");
  }

  return null;
}
