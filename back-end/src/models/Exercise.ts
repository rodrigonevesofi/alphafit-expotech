import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Exercise extends Model {}
Exercise.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  muscleGroup: { type: DataTypes.STRING, allowNull: false },
  difficulty: { type: DataTypes.STRING, allowNull: false },
  equipment: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, tableName: "exercises" });
