import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import { NextFunction } from "express";
import Middleware from "./Middleware";
import IApplication from "../Interfaces/IApplication";

export default class SysAdminMiddleware extends Middleware {
  public app: IApplication;

  constructor(app: IApplication) {
    super();
    this.app = app;
  }

  execute(request: IRequest, response: IResponse, next: NextFunction): void {
    if (!request.user.is_system_admin) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    next();
  }
}
