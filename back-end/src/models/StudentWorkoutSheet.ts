import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class StudentWorkoutSheet extends Model {}

StudentWorkoutSheet.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },

    title: { type: DataTypes.STRING, allowNull: false },
    focus: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "active" },
  },
  {
    sequelize,
    tableName: "student_workout_sheets",
  }
);