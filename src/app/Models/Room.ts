import { Model, DataTypes } from "sequelize";
import database from "../Config/Database";

class Room extends Model {
  public id!: number;
  public name!: string;
  public entity_id!: number;
}

Room.init(
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
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "Room",
    tableName: "rooms",
    timestamps: false,
  }
);

export default Room;
