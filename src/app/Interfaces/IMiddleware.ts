import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import { NextFunction } from "express";
import IApplication from "./IApplication";

export default interface IMiddleware {
  execute(request: IRequest, response: IResponse, next: NextFunction): void;

  handle(): (
    request: IRequest,
    response: IResponse,
    next: NextFunction
  ) => void;
}
