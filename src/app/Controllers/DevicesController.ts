import { Op, Sequelize } from "sequelize";
import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import {
  Device,
  DeviceEnergy,
  Entity,
  EntityType,
  Room,
  User,
} from "../Models";
import Controller from "./Controller";
import {
  addDeviceSchema,
  deleteDevicesSchema,
  updateDeviceSchema,
} from "../Validation/DeviceSchema";
import IApplication from "../Interfaces/IApplication";

export default class DevicesController extends Controller {
  public app: IApplication;

  constructor(app: IApplication) {
    super();
    this.app = app;
  }

  all = async (request: IRequest, response: IResponse) => {
    const devices = await Device.findAll({
      include: [
        {
          model: Room,
          required: false,
          as: "room",
          include: [
            {
              model: Entity,
              required: false,
              as: "entity",
              include: [
                {
                  model: User,
                  required: false,
                  as: "user",
                  attributes: {
                    exclude: ["password"],
                  },
                },
              ],
            },
          ],
        },
        {
          model: DeviceEnergy,
          required: false,
          as: "energies",
          attributes: {
            include: [
              "id",
              ["id", "_id"],
              "value",
              "time",
              [Sequelize.literal("false"), "is_new"],
            ],
          },
          order: [["id", "DESC"]],
        },
      ],
      order: [["id", "DESC"]],
    });

    response.json({
      data: devices,
    });
  };

  store = async (request: IRequest, response: IResponse) => {
    const { error } = addDeviceSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    const device = await Device.create({
      room_id: request.body.room.id,
      name: request.body.name,
      status: request.body.status,
    });

    request.body.energies.map((room: any) => {
      DeviceEnergy.create({
        value: room.value,
        time: room.time,
        device_id: device.id,
      });
    });

    this.success(response, "Device has been added successfully");
  };

  update = async (request: IRequest, response: IResponse) => {
    const device = await Device.findOne({
      where: {
        id: request.params.id,
      },
    });

    if (!device) return this.failed(response, "Device not found");

    const { error } = updateDeviceSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    await device.update({
      room_id: request.body.room.id,
      name: request.body.name,
      status: request.body.status,
    });

    const updatedRecords = request.body.energies
      .filter((item: any) => item.is_new === false)
      .map((item: any) => item._id);

    await DeviceEnergy.destroy({
      where: {
        device_id: device.id,
        id: {
          [Op.notIn]: updatedRecords,
        },
      },
    });

    request.body.energies.map((energy: any) => {
      if (energy.is_new) {
        DeviceEnergy.create({
          device_id: device.id,
          value: energy.value,
          time: energy.time,
        });
      } else {
        DeviceEnergy.findOne({
          where: {
            id: energy._id,
          },
        }).then((rescord) => {
          rescord?.update({
            value: energy.value,
            time: energy.time,
          });
        });
      }
    });

    this.success(response, "Device has been updated successfully");
  };

  delete = async (request: IRequest, response: IResponse) => {
    const { error } = deleteDevicesSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    await Device.destroy({
      where: {
        id: request.body.ids,
      },
    });

    return this.success(response, "Devices has been deleted successfully");
  };

  userAll = async (request: IRequest, response: IResponse) => {
    const devices = await Device.findAll({
      include: [
        {
          model: Room,
          required: true,
          as: "room",
          include: [
            {
              model: Entity,
              required: true,
              as: "entity",
              where: {
                user_id: request.user.id,
              },
              include: [
                {
                  model: User,
                  required: false,
                  as: "user",
                  attributes: {
                    exclude: ["password"],
                  },
                },
                {
                  model: EntityType,
                  required: false,
                  as: "type",
                },
              ],
            },
          ],
        },
        {
          model: DeviceEnergy,
          required: false,
          as: "energies",
          attributes: {
            include: [
              "id",
              ["id", "_id"],
              "value",
              "time",
              [Sequelize.literal("false"), "is_new"],
            ],
          },
          order: [["id", "DESC"]],
        },
      ],
      order: [["id", "DESC"]],
    });

    response.json({
      data: devices,
    });
  };

  userStore = async (request: IRequest, response: IResponse) => {
    const { error } = addDeviceSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    const device = await Device.create({
      room_id: request.body.room.id,
      name: request.body.name,
      status: request.body.status,
    });

    request.body.energies.map((room: any) => {
      DeviceEnergy.create({
        value: room.value,
        time: room.time,
        device_id: device.id,
      });
    });

    this.success(response, "Device has been added successfully");
  };

  userUpdate = async (request: IRequest, response: IResponse) => {
    const device = await Device.findOne({
      where: {
        id: request.params.id,
      },
      include: [
        {
          model: Room,
          required: true,
          as: "room",
          include: [
            {
              model: Entity,
              required: true,
              as: "entity",
              where: {
                user_id: request.user.id,
              },
              include: [
                {
                  model: User,
                  as: "user",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!device) return this.failed(response, "Device not found");

    const { error } = updateDeviceSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    await device.update({
      room_id: request.body.room.id,
      name: request.body.name,
      status: request.body.status,
    });

    const updatedRecords = request.body.energies
      .filter((item: any) => item.is_new === false)
      .map((item: any) => item._id);

    await DeviceEnergy.destroy({
      where: {
        device_id: device.id,
        id: {
          [Op.notIn]: updatedRecords,
        },
      },
    });

    request.body.energies.map((energy: any) => {
      if (energy.is_new) {
        DeviceEnergy.create({
          device_id: device.id,
          value: energy.value,
          time: energy.time,
        });
      } else {
        DeviceEnergy.findOne({
          where: {
            id: energy._id,
          },
        }).then((rescord) => {
          rescord?.update({
            value: energy.value,
            time: energy.time,
          });
        });
      }
    });

    console.log(device.room.entity.user.email);

    this.app.io.in(device.room.entity.user.email).emit("dashboard_changed");

    this.success(response, "Device has been updated successfully");
  };

  userDelete = async (request: IRequest, response: IResponse) => {
    const { error } = deleteDevicesSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    await Device.destroy({
      where: {
        id: request.body.ids,
        user_id: request.user.id,
      },
    });

    return this.success(response, "Devices has been deleted successfully");
  };
}
