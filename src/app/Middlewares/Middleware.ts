import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import { NextFunction } from "express";
import IMiddleware from "../Interfaces/IMiddleware";
import IApplication from "../Interfaces/IApplication";

export default abstract class Middleware implements IMiddleware {
  abstract execute(
    request: IRequest,
    response: IResponse,
    next: NextFunction
  ): void;

  handle =
    () => (request: IRequest, response: IResponse, next: NextFunction) => {
      try {
        this.execute(request, response, next);
      } catch (error) {
        next(error);
      }
    };
}
