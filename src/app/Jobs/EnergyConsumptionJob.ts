import IApplication from "../Interfaces/IApplication";
import IJob from "../Interfaces/IJob";
import cron from "node-cron";

export default class EnergyConsumptionJob implements IJob {
  handle(app: IApplication): void {}

  schedule(app: IApplication): void {
    cron.schedule("*/5 * * * * *", () => this.handle(app));
  }
}
