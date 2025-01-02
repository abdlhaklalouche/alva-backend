import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import { NextFunction } from "express";
import Middleware from "./Middleware";
import jwt from "jsonwebtoken";

export default class GuestMiddleware extends Middleware {
  execute(request: IRequest, response: IResponse, next: NextFunction): void {
    const authorization = request.headers.authorization;

    if (!authorization) {
      next();
      return;
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      (err: any, user: any) => {
        if (err) {
          next();
          return;
        }

        response.status(403).json({ message: "Forbidden" });
      }
    );
  }
}
