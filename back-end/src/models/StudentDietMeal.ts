import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class StudentDietMeal extends Model {}

StudentDietMeal.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    dietPlanId: { type: DataTypes.INTEGER, allowNull: false },

    mealName: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.STRING, allowNull: true },
    items: { type: DataTypes.TEXT, allowNull: false },
    kcal: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: "student_diet_meals",
  }
);