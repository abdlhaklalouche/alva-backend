import IController from "../Interfaces/IController";
import IResponse from "../Interfaces/IResponse";

class Controller implements IController {
  success(
    response: IResponse,
    message: string = "Success",
    data: any = [],
    status: number = 200
  ): void {
    response.status(status).json({
      message,
      data,
    });
  }

  failed(
    response: IResponse,
    message: string = "Failed",
    errors: any = [],
    status: number = 400
  ): void {
    response.status(status).json({
      message,
      errors,
    });
  }
}

export default Controller;
