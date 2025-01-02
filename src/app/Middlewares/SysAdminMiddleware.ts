import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import { NextFunction } from "express";
import Middleware from "./Middleware";

export default class SysAdminMiddleware extends Middleware {
  execute(request: IRequest, response: IResponse, next: NextFunction): void {
    if (!request.user.is_system_admin) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    next();
  }
}
