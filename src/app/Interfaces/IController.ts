import { Response } from "express";

export default interface IController {
  response(
    response: Response,
    message: string,
    data: any,
    status: number,
    statusText: string
  ): void;

  success(
    response: Response,
    message?: string,
    data?: any,
    status?: number
  ): void;

  failed(
    response: Response,
    message?: string,
    data?: any,
    status?: number
  ): void;
}
