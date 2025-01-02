import { Model, DataTypes } from "sequelize";
import database from "../Config/Database";

class Device extends Model {
  public id!: number;
  public name!: string;
  public room_id!: number;
}

Device.init(
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
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "Device",
    tableName: "devices",
    timestamps: false,
  }
);

export default Device;
