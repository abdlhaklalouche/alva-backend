import IApplication from "../Interfaces/IApplication";
import IJob from "../Interfaces/IJob";
import cron from "node-cron";
import { Device, DeviceEnergy, Entity, Room, User } from "../Models";
import { normalize } from "../../utils";
import * as tf from "@tensorflow/tfjs-node";
import MLEnergyModel from "../MLModels/MLEnergyModel";
import { IMLModelNormalization } from "../Interfaces/IMLModel";

export default class TrainModelsJob implements IJob {
  async handle(app: IApplication): Promise<void> {
    const devices = await Device.findAll({
      include: [
        {
          model: Room,
          required: true,
          as: "room",
          attributes: ["id", "entity_id"],
          nested: true,
          include: [
            {
              model: Entity,
              required: true,
              as: "entity",
              attributes: ["id", "user_id"],
              include: [
                {
                  model: User,
                  as: "user",
                  required: true,
                  attributes: ["id"],
                },
              ],
            },
          ],
        },
        {
          model: DeviceEnergy,
          required: false,
          as: "energies",
          attributes: ["value", "time"],
          order: [["id", "DESC"]],
        },
      ],
      attributes: ["id", "name"],
      order: [["id", "DESC"]],
      nest: true,
      raw: true,
    });

    devices.forEach((device: any) => {
      device.room_id = device.room.id;
      device.user_id = device.room.entity.user.id;
      device.entity_id = device.room.entity.id;
      device.value = device.energies ? parseFloat(device.energies.value) : 0;
      device.time = device.energies.time;

      delete device.room;
      delete device.energies;
    });

    const data = devices.map((item: any) => {
      const timestamp = new Date(item.time);

      return {
        id: item.id,
        user_id: item.user_id,
        entity_id: item.entity_id,
        room_id: item.room_id,
        value: item.value ? parseFloat(item.value) : 0,
        minute: timestamp.getMinutes(),
        hour: timestamp.getHours(),
        dayOfWeek: timestamp.getDay(),
        dayOfMonth: timestamp.getDate(),
      };
    });

    const processedData = data.map((item: any) => [
      item.id,
      item.user_id,
      item.entity_id,
      item.room_id,
      item.minute,
      item.hour,
      item.dayOfWeek,
      item.dayOfMonth,
    ]);

    const values = data.map((item) => item.value);

    const inputMin = Math.min(...processedData.flat());
    const inputMax = Math.max(...processedData.flat());
    const valueMin = Math.min(...values);
    const valueMax = Math.max(...values);

    const normalizedInputs = processedData.map((row: any) =>
      normalize(row, inputMin, inputMax)
    );

    const normalizedOutputs = normalize(values, valueMin, valueMax);

    const inputTensor = tf.tensor2d(normalizedInputs);
    const outputTensor = tf.tensor2d(normalizedOutputs, [values.length, 1]);

    const normalization: IMLModelNormalization = {
      inputMin,
      inputMax,
      valueMin,
      valueMax,
    };

    const model = new MLEnergyModel();

    const modelObject = await model.create();

    await model.train(modelObject, inputTensor, outputTensor);

    await model.save(modelObject, normalization);
  }

  schedule(app: IApplication): void {
    cron.schedule("0 */30 * * * *", () => this.handle(app));
  }
}
