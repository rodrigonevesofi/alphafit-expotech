import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class ChatMessage extends Model {
  declare id: number;
  declare sessionId: string;
  declare userId: number | null;
  declare sender: "user" | "bot";
  declare message: string;
}

ChatMessage.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sessionId: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  sender: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
}, { sequelize, tableName: "chat_messages" });
