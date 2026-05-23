import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class StudentDietPlan extends Model {}

StudentDietPlan.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },

    focus: { type: DataTypes.STRING, allowNull: false },
    totalKcal: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "active" },
  },
  {
    sequelize,
    tableName: "student_diet_plans",
  }
);