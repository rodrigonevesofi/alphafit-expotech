import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class WorkoutPlan extends Model {}
WorkoutPlan.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  objective: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, tableName: "workout_plans" });
