import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare phone: string | null;
  declare password: string;
  declare role: "student" | "admin";
  declare biotype: string | null;
}

User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: "student" },
  biotype: { type: DataTypes.STRING, allowNull: true },
}, { sequelize, tableName: "users" });
