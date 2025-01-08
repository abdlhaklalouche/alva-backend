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

    const devices = await Device.count({
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

    const rooms = await Room.count({
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

    const entities = await Entity.count({
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
          include: [
            {
              model: Room,
              as: "room",
              include: [
                {
                  model: Entity,
                  as: "entity",
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

    response.json({
      consumption: energyData,
      devices: devices,
      entities: entities,
      rooms: rooms,
    });
  };

  insights = async (request: IRequest, response: IResponse) => {
    const period = FilterPeriod.month; // (request.query.period ?? FilterPeriod.month) as FilterPeriod;

    const { startDate, endDate } = getDateRange(period);

    const result = await DeviceEnergy.findAll({
      attributes: [
        [
          Sequelize.literal("TO_CHAR(CAST(time AS timestamp), 'YYYY-MM-DD')"),
          "day", // Group by date in 'yyyy-mm-dd' format
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
          include: [
            {
              model: Room,
              as: "room",
              include: [
                {
                  model: Entity,
                  as: "entity",
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
                  attributes: [
                    [
                      Sequelize.fn("SUM", Sequelize.col("value")),
                      "total_energy",
                    ],
                  ],
                  required: true,
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        "id",
        "name",
        [
          Sequelize.literal(
            `(SELECT SUM("value") FROM "devices_energies" WHERE "devices_energies"."device_id" = "rooms->devices"."id")`
          ),
          "total_energy_for_entity",
        ],
      ],
      group: [
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
          attributes: ["name"],
          include: [
            {
              model: Room,
              as: "room",
              attributes: [],
              include: [
                {
                  model: Entity,
                  as: "entity",
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
        Sequelize.col("device.id"), // Group by the device name
        Sequelize.col("device.name"), // Group by the device name
      ],
      order: [
        [Sequelize.fn("date", Sequelize.col("time")), "ASC"], // Order by date
        [Sequelize.col("device.name"), "ASC"], // Optionally, order by device name
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

    const entitiesData = entities.map((entity) => ({
      entity: entity.name,
      consumption: parseInt(entity.dataValues.total_energy_for_entity ?? 0),
      fill: getRandomBlackShade(),
    }));

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
    });
  };
}
