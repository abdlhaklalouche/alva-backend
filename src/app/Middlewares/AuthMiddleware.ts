import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import { NextFunction } from "express";
import Middleware from "./Middleware";
import jwt from "jsonwebtoken";
import { User } from "../Models";

export default class AuthMiddleware extends Middleware {
  execute(request: IRequest, response: IResponse, next: NextFunction): void {
    const authorization = request.header("Authorization");

    if (!authorization) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      async (err: any, data: any) => {
        if (err) return response.status(403).json({ message: "Forbidden" });

        const user = await User.findOne({
          where: {
            id: data?.id,
          },
          attributes: ["id", "name", "email", "is_system_admin"],
        });

        if (!user) response.status(403).json({ message: "Forbidden" });

        request.user = user;

        next();
      }
    );
  }
}
