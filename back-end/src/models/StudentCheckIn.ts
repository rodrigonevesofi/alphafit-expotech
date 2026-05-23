import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class StudentCheckIn extends Model {}

StudentCheckIn.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },

    workoutName: { type: DataTypes.STRING, allowNull: false },
    checkinDate: { type: DataTypes.DATEONLY, allowNull: false },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    tableName: "student_checkins",
  }
);