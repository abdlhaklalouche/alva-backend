import { Model, DataTypes } from "sequelize";
import database from "../Config/Database";
import Entity from "./Entity";

class EntityType extends Model {
  public id!: number;
  public name!: string;
  public icon!: string;
}

EntityType.init(
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
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "EntityType",
    tableName: "entity_types",
    timestamps: false,
  }
);

export default EntityType;
