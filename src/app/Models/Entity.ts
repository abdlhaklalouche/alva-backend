import { Model, DataTypes } from "sequelize";
import database from "../Config/Database";
import EntityType from "./EntityType";
import User from "./User";

class Entity extends Model {
  public id!: number;
  public name!: string;
  public user_id!: number;
  public type_id!: number;
  public type!: EntityType;
  public user!: User;
}

Entity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "Entity",
    tableName: "entities",
    timestamps: false,
  }
);

export default Entity;
