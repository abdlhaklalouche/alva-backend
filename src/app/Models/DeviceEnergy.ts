import { Model, DataTypes } from "sequelize";
import database from "../Config/Database";
import Device from "./Device";

class DeviceEnergy extends Model {
  public id!: number;
  public name!: string;
  public device_id!: number;
}

DeviceEnergy.init(
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
    device_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "DeviceEnergy",
    tableName: "devices_energies",
    timestamps: false,
  }
);

export default DeviceEnergy;
