import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import Controller from "./Controller";
import IApplication from "../Interfaces/IApplication";
import { getDateRange, getRandomBlackShade, normalize } from "../../utils";
import { Device, DeviceEnergy, Entity, Room, User } from "../Models";
import { Op, Sequelize } from "sequelize";
import { FilterPeriod } from "../Enum/FilterPeriod";
import MLEnergyModel from "../MLModels/MLEnergyModel";
import * as tf from "@tensorflow/tfjs-node";
import moment from "moment";

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
    const { startDate, endDate } = getDateRange(FilterPeriod.month);

    const devices = await DeviceEnergy.findAll({
      attributes: [
        [Sequelize.col("device.id"), "id"],
        [Sequelize.col("device->room->entity->user.id"), "user_id"],
        [Sequelize.col("device->room.id"), "room_id"],
        [Sequelize.col("device->room->entity.id"), "entity_id"],
        [Sequelize.col("device.name"), "deviceName"],
        [Sequelize.fn("date", Sequelize.col("time")), "date"],
        [Sequelize.fn("sum", Sequelize.col("value")), "value"],
      ],
      include: [
        {
          model: Device,
          as: "device",
          required: true,
          attributes: [],
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
        Sequelize.col("device->room.id"),
        Sequelize.col("device->room->entity.id"),
        Sequelize.col("device->room->entity->user.id"),
      ],
      order: [
        [Sequelize.fn("date", Sequelize.col("time")), "ASC"],
        [Sequelize.col("device.name"), "ASC"],
      ],
    });

    const totalData = Object.values(
      devices.reduce((total: any, device: any) => {
        const { id, room_id, entity_id, user_id, deviceName, value } =
          device.dataValues;

        if (!total[device.id]) {
          total[device.id] = {
            id,
            room_id,
            entity_id,
            user_id,
            name: deviceName,
            value: 0,
          };
        }

        total[device.id].value += parseFloat(device.value);

        return total;
      }, {})
    );

    // Predicting data from the stored ML model.

    const base = new MLEnergyModel();

    const { model, normalization } = await base.load();

    const nextMonthInputData: any = [];
    const today = moment();

    const tomorrow = today.clone().add(1, "day");

    for (let i = 0; i <= 30; i++) {
      for (let hour = 0; hour < 24; hour++) {
        const futureDate = tomorrow.clone().add(i, "day").add(hour, "hours");

        totalData.map((device: any) => {
          nextMonthInputData.push([
            device.name,
            device.id,
            device.user_id,
            device.entity_id,
            device.room_id,
            0,
            hour,
            futureDate.day(),
            futureDate.date(),
            futureDate.format("YYYY-MM-DD HH:mm"),
          ]);
        });
      }
    }

    const predictableData = nextMonthInputData.map((data: any) => [
      data[1],
      data[2],
      data[3],
      data[4],
      data[5],
      data[6],
      data[7],
      data[8],
    ]);

    const normalizedInput = predictableData.map((row: number[]) =>
      row.map(
        (value, index) =>
          (value - normalization.inputMin) /
          (normalization.inputMax - normalization.inputMin)
      )
    );

    const inputTensor = tf.tensor2d(normalizedInput);

    const prediction = model.predict(inputTensor) as tf.Tensor;

    const predictions = prediction
      .dataSync()
      .map(
        (value) =>
          value * (normalization.valueMax - normalization.valueMin) +
          normalization.valueMin
      );

    // formtting data.

    const formattedData = predictableData.map((row: any, index: any) => {
      const time = nextMonthInputData[index][9];
      const date = moment(time).format("YYYY-MM-DD");

      const consumption = predictions[index];

      return {
        name: nextMonthInputData[index][0],
        id: nextMonthInputData[index][1],
        user_id: nextMonthInputData[index][2],
        entity_id: nextMonthInputData[index][3],
        room_id: nextMonthInputData[index][4],

        time: time,
        date: date,

        consumption: consumption > 0 ? consumption : 0,
      };
    });

    // Calculating overall chart data.

    const overallRateChartData = Object.values(
      formattedData.reduce((acc: any, { id, name, date, consumption }: any) => {
        if (!acc[date]) {
          acc[date] = {
            date,
            total: 0,
          };
        }

        acc[date].total += consumption;

        return acc;
      }, {})
    );

    // Calculating devices chart data.

    const devicesRateData = Object.values(
      formattedData.reduce(
        (acc: any, { id, name, date, time, consumption }: any) => {
          const key = `${id}-${date}`;

          if (!acc[key]) {
            acc[key] = {
              id,
              name,
              date,
              total: 0,
            };
          }

          acc[key].total += consumption;

          return acc;
        },
        {}
      )
    );

    const devicesRateChartData = devicesRateData.reduce(
      (acc: any, { date, name, total }: any) => {
        let existingEntry = acc.find((entry: any) => entry.date === date);

        if (!existingEntry) {
          existingEntry = { date, devices: {} };
          acc.push(existingEntry);
        }

        existingEntry.devices[name] = total;

        return acc;
      },
      []
    );

    response.json({
      devices: devicesRateChartData,
      overall: overallRateChartData,
    });
  };
}
