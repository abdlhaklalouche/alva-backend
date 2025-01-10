import IApplication from "../Interfaces/IApplication";
import IJob from "../Interfaces/IJob";

export default class EnergyConsumptionJob implements IJob {
  handle(app: IApplication): void {}
}
