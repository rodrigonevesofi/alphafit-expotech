import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { sequelize } from "./config/database";
import { warmOllama } from "./services/ollamaService";
import "./models";

const PORT = Number(process.env.PORT) || 3333;
const OLLAMA_WARMUP_INTERVAL_MS = Number(process.env.OLLAMA_WARMUP_INTERVAL_MS || 8 * 60 * 1000);

function startOllamaWarmup() {
  if (process.env.OLLAMA_WARMUP_ENABLED === "false") {
    console.log("[ollama] warm-up desativado por OLLAMA_WARMUP_ENABLED=false");
    return;
  }

  let running = false;

  const run = async () => {
    if (running) return;

    running = true;

    try {
      const result = await warmOllama();
      console.log(`[ollama] modelo ${result.model} aquecido em ${result.durationMs}ms`);
    } catch (error: any) {
      console.warn(`[ollama] warm-up falhou: ${error?.message || error}`);
    } finally {
      running = false;
    }
  };

  run();

  if (OLLAMA_WARMUP_INTERVAL_MS > 0) {
    const timer = setInterval(run, OLLAMA_WARMUP_INTERVAL_MS);
    timer.unref?.();
  }
}

async function bootstrap() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`API ALPHAFIT em http://localhost:${PORT}`);
    console.log(`Swagger em http://localhost:${PORT}/api-docs`);
    startOllamaWarmup();
  });
}

bootstrap().catch((err) => {
  console.error("Erro ao iniciar API:", err);
  process.exit(1);
});
