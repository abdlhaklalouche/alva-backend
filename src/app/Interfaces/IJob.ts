import IApplication from "./IApplication";
import cron from "node-cron";

export default interface IJob {
  handle(app: IApplication): Promise<void>;
  schedule(app: IApplication): void;
}
