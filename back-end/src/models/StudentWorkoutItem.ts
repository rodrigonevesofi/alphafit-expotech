import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class StudentWorkoutItem extends Model {}

StudentWorkoutItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    sheetId: { type: DataTypes.INTEGER, allowNull: false },

    day: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    sets: { type: DataTypes.STRING, allowNull: true },
    reps: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: "student_workout_items",
  }
);