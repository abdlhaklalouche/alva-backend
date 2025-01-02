import IResponse from "./IResponse";

export default interface IController {
  success(
    response: IResponse,
    message?: string,
    data?: any,
    status?: number
  ): void;

  failed(
    response: IResponse,
    message?: string,
    errors?: any,
    status?: number
  ): void;
}
