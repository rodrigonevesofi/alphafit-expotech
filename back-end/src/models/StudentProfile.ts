import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class StudentProfile extends Model {}

StudentProfile.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },

    goal: { type: DataTypes.STRING, allowNull: false, defaultValue: "Hipertrofia" },
    level: { type: DataTypes.STRING, allowNull: false, defaultValue: "Iniciante" },
    weeklyGoal: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 4 },
    focus: { type: DataTypes.STRING, allowNull: false, defaultValue: "Consistência" },
    activePlanName: { type: DataTypes.STRING, allowNull: false, defaultValue: "Plano inicial" },

    biotypeUsed: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: "student_profiles",
  }
);