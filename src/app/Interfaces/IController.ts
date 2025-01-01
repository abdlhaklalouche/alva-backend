import { Response } from "express";

export default interface IController {
  success(
    response: Response,
    message?: string,
    data?: any,
    status?: number
  ): void;

  failed(
    response: Response,
    message?: string,
    errors?: any,
    status?: number
  ): void;
}
