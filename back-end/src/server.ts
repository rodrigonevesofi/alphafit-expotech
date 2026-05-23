import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { sequelize } from "./config/database";
import "./models";

const PORT = Number(process.env.PORT) || 3333;

async function bootstrap() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`API ALPHAFIT em http://localhost:${PORT}`);
    console.log(`Swagger em http://localhost:${PORT}/api-docs`);
  });
}

bootstrap().catch((err) => {
  console.error("Erro ao iniciar API:", err);
  process.exit(1);
});
