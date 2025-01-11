import { Model, DataTypes } from "sequelize";
import database from "../Config/Database";
import Room from "./Room";

class Device extends Model {
  public id!: number;
  public name!: string;
  public status!: string;
  public last_time_on!: string;
  public notified!: boolean;
  public room_id!: number;
  public room!: Room;
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_time_on: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notified: {
      type: DataTypes.BOOLEAN,
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
