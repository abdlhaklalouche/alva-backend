import express, { Request, Response } from "express";
import IController from "../Interfaces/IController";

class Controller implements IController {
  response(
    response: Response,
    message: string,
    data: any,
    status: number,
    statusText: string
  ): void {
    response.status(status).json({
      status: statusText,
      message,
      data,
    });
  }

  success(
    response: Response,
    message: string = "Success",
    data: any[] = []
  ): void {
    this.response(response, message, data, 200, "success");
  }

  failed(
    response: Response,
    message: string = "Failed",
    data: any[] = []
  ): void {
    this.response(response, message, data, 400, "failed");
  }
}

export default Controller;
