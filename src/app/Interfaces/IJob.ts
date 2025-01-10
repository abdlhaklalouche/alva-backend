import IApplication from "./IApplication";

export default interface IJob {
  handle(app: IApplication): void;
}
