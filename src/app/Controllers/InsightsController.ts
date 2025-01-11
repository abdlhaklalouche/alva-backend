import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import Controller from "./Controller";
import IApplication from "../Interfaces/IApplication";
import { getDateRange, getRandomBlackShade } from "../../utils";
import { Device, DeviceEnergy, Entity, Room } from "../Models";
import { Op, Sequelize } from "sequelize";
import { FilterPeriod } from "../Enum/FilterPeriod";

export default class InsightsController extends Controller {
  public app: IApplication;

  constructor(app: IApplication) {
    super();
    this.app = app;
  }

  dashboard = async (request: IRequest, response: IResponse) => {
    const period = (request.query.period ?? FilterPeriod.month) as FilterPeriod;

    const { startDate, endDate } = getDateRange(period);

    const devicesCount = await Device.count({
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
            },
          ],
        },
      ],
    });

    const roomsCount = await Room.count({
      include: [
        {
          model: Entity,
          required: true,
          as: "entity",
          where: {
            user_id: request.user.id,
          },
        },
      ],
    });

    const entitiesCount = await Entity.count({
      where: {
        user_id: request.user.id,
      },
    });

    const result = await DeviceEnergy.findAll({
      attributes: [
        [
          Sequelize.literal("TO_CHAR(CAST(time AS timestamp), 'YYYY-MM-DD')"),
          "day",
        ],
        [
          Sequelize.fn("SUM", Sequelize.literal("CAST(value AS NUMERIC)")),
          "total",
        ],
        "device.id",
        "device.room.id",
        "device.room.entity.id",
        "device.room.entity.id",
      ],
      include: [
        {
          model: Device,
          as: "device",
          required: true,
          include: [
            {
              model: Room,
              as: "room",
              required: true,
              include: [
                {
                  model: Entity,
                  as: "entity",
                  required: true,
                  where: {
                    user_id: request.user.id,
                  },
                },
              ],
            },
          ],
        },
      ],
      where: {
        time: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [
        Sequelize.literal(
          "TO_CHAR(CAST(time AS timestamp), 'YYYY-MM-DD')"
        ) as any,
        "device.id",
        "device.room.id",
        "device.room.entity.id",
      ],
      order: [["day", "ASC"]],
    });

    const entities = await Entity.findAll({
      where: {
        user_id: request.user.id,
      },
      include: [
        {
          model: Room,
          as: "rooms",
          include: [
            {
              model: Device,
              as: "devices",
              include: [
                {
                  model: DeviceEnergy,
                  as: "energies",
                  where: {
                    time: {
                      [Op.between]: [startDate, endDate],
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        "id",
        "name",
        [Sequelize.fn("date", Sequelize.col("time")), "date"],
      ],
      group: [
        [Sequelize.fn("date", Sequelize.col("time")), "date"] as any,
        "Entity.id",
        "rooms.id",
        "rooms->devices.id",
        "rooms->devices->energies.id",
      ],
    });

    const devices = await DeviceEnergy.findAll({
      attributes: [
        [Sequelize.fn("date", Sequelize.col("time")), "date"],
        [Sequelize.fn("sum", Sequelize.col("value")), "value"],
        [Sequelize.col("device.name"), "deviceName"],
      ],
      include: [
        {
          model: Device,
          as: "device",
          required: true,
          attributes: ["name"],
          include: [
            {
              model: Room,
              as: "room",
              required: true,
              attributes: [],
              include: [
                {
                  model: Entity,
                  as: "entity",
                  required: true,
                  attributes: [],
                  where: {
                    user_id: request.user.id,
                  },
                },
              ],
            },
          ],
        },
      ],
      where: {
        time: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [
        Sequelize.fn("date", Sequelize.col("time")),
        Sequelize.col("device.id"),
        Sequelize.col("device.name"),
      ],
      order: [
        [Sequelize.fn("date", Sequelize.col("time")), "ASC"],
        [Sequelize.col("device.name"), "ASC"],
      ],
    });

    const groupedEnergiesData = result.reduce((acc: any, deviceEnergy: any) => {
      const total = parseFloat(deviceEnergy.dataValues.total);

      if (!acc[deviceEnergy.dataValues.day]) {
        acc[deviceEnergy.dataValues.day] = 0;
      }
      acc[deviceEnergy.dataValues.day] += total;

      return acc;
    }, {});

    const energyData = Object.keys(groupedEnergiesData).map((key) => ({
      key: key,
      value: groupedEnergiesData[key],
    }));

    const entitiesData = entities.map((entity: any) => {
      const totalEnergy = entity.rooms.reduce((roomSum: any, room: any) => {
        return (
          roomSum +
          room.devices.reduce((deviceSum: any, device: any) => {
            return (
              deviceSum +
              device.energies.reduce((energySum: any, energy: any) => {
                return energySum + parseFloat(energy.value);
              }, 0)
            );
          }, 0)
        );
      }, 0);

      return {
        id: entity.id,
        name: entity.name,
        consumption: totalEnergy,
        fill: getRandomBlackShade(),
      };
    });

    const groupedData: {
      [date: string]: { [deviceName: string]: string | number };
    } = {};

    devices.forEach((entry: any) => {
      const { date, deviceName, value } = entry.dataValues;

      if (!groupedData[date]) {
        groupedData[date] = {};
      }

      groupedData[date][deviceName] = parseInt(value);
    });

    const devicesData: any = Object.entries(groupedData).map(
      ([date, devices]) => {
        return { date, devices: { ...devices } };
      }
    );

    response.json({
      consumption: energyData,
      entities_consumption: entitiesData,
      devices_consumption: devicesData,
      counts: {
        entities: entitiesCount,
        rooms: roomsCount,
        devices: devicesCount,
      },
    });
  };

  insights = async (request: IRequest, response: IResponse) => {
    response.json({});
  };
}
