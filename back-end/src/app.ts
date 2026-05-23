import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";
import workoutRoutes from "./routes/workoutRoutes";
import { swaggerSpec } from "./docs/swagger";
import studentDashboardRoutes from "./routes/studentDashboardRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "API ALPHAFIT rodando." });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/exercises", exerciseRoutes);
app.use("/workout-plans", workoutRoutes);
app.use("/student-dashboard", studentDashboardRoutes);

export default app;
