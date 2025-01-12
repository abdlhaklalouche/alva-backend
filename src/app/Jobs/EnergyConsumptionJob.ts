import IApplication from "../Interfaces/IApplication";
import IJob from "../Interfaces/IJob";
import cron from "node-cron";
import { Device, Entity, Room, User } from "../Models";
import { DeviceStatus } from "../Enum/DeviceStatus";
import moment from "moment";
import { Op } from "sequelize";
import INotification from "../Interfaces/INotification";

export default class EnergyConsumptionJob implements IJob {
  async handle(app: IApplication): Promise<void> {
    const oneHourAgo = moment().subtract(1, "hours").format("YYYY-MM-DD HH:mm");

    const devices = await Device.findAll({
      where: {
        status: DeviceStatus.ON,
        notified: false,
        last_time_on: {
          [Op.lt]: oneHourAgo,
        },
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

    devices.forEach((device) => {
      app.io.in(device.room.entity.user.email).emit("notification", {
        title: `${device.name} in ${device.room.name} | ${device.room.entity.name}`,
        description: "Is being running for more than one hour",
      } as INotification);

      device.update({
        notified: true,
      });
    });
  }

  schedule(app: IApplication): void {
    cron.schedule("0 */2 * * * *", () => this.handle(app));
  }
}
