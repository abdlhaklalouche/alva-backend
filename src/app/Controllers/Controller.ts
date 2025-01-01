import { Response } from "express";
import IController from "../Interfaces/IController";

class Controller implements IController {
  success(
    response: Response,
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
    response: Response,
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
