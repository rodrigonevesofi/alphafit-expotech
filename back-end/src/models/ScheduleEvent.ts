import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class ScheduleEvent extends Model {}

ScheduleEvent.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },

    title: { type: DataTypes.STRING, allowNull: false },
    eventDate: { type: DataTypes.DATE, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false, defaultValue: "training" },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "scheduled" },
  },
  {
    sequelize,
    tableName: "schedule_events",
  }
);