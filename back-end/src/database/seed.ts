import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import { sequelize } from "../config/database";
import { User, Exercise, WorkoutPlan } from "../models";

async function seed() {
  await sequelize.sync({ force: true });

  await User.bulkCreate([
    { name: "Administrador ALPHAFIT", email: "admin@alphafit.com", phone: "11999990000", password: await bcrypt.hash("123456", 8), role: "admin" },
    { name: "Aluno Demo", email: "aluno@alphafit.com", phone: "11988880000", password: await bcrypt.hash("123456", 8), role: "student" }
  ] as any[]);

  await Exercise.bulkCreate([
    { name: "Agachamento livre", muscleGroup: "Pernas", difficulty: "Intermediário", equipment: "Barra", description: "Exercício base para membros inferiores." },
    { name: "Supino reto", muscleGroup: "Peito", difficulty: "Intermediário", equipment: "Banco e barra", description: "Movimento principal para peitoral." },
    { name: "Remada baixa", muscleGroup: "Costas", difficulty: "Iniciante", equipment: "Máquina", description: "Exercício para dorsais e postura." }
  ] as any[]);

  await WorkoutPlan.bulkCreate([
    { title: "Full Body 3x", objective: "Emagrecimento e constância", level: "Iniciante", duration: 45, description: "Treino completo três vezes por semana." },
    { title: "Hipertrofia ABC", objective: "Ganho de massa", level: "Intermediário", duration: 60, description: "Divisão por grupos musculares." }
  ] as any[]);

  console.log("Banco SQLite populado com sucesso.");
  process.exit(0);
}

seed();
