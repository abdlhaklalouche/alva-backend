import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import { NextFunction } from "express";
import Middleware from "./Middleware";
import jwt from "jsonwebtoken";
import { User } from "../Models";

export default class AuthMiddleware extends Middleware {
  execute(request: IRequest, response: IResponse, next: NextFunction): void {
    const authorization = request.headers.authorization;

    if (!authorization) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      async (err: any, data: any) => {
        if (err) response.status(403).json({ message: "Forbidden" });

        const user = await User.findOne({
          where: {
            id: data.id,
          },
        });

        if (!user) response.status(403).json({ message: "Forbidden" });

        console.log(user);

        request.user = user;

        next();
      }
    );
  }
}
