import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import Controller from "./Controller";
import { Entity, EntityType, User } from "../Models";
import {
  addUserSchema,
  deleteUsersSchema,
  loginUserSchema,
  updateUserSchema,
} from "../Validation/UserSchema";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class UsersController extends Controller {
  all = async (request: IRequest, response: IResponse) => {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "is_system_admin"],
    });

    response.json({
      data: users,
    });
  };

  login = async (request: IRequest, response: IResponse) => {
    const { error } = loginUserSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    const user = await User.findOne({
      where: {
        email: request.body.email,
      },
    });

    if (!user) return this.failed(response, "Invalid email", [], 401);

    const isPasswordMatch = await bcrypt.compare(
      request.body.password,
      user.password
    );

    if (!isPasswordMatch)
      return this.failed(response, "Invalid password", [], 401);

    const token = jwt.sign(
      {
        id: user.id,
        is_system_admin: user.is_system_admin,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "2 days",
      }
    );

    response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    this.success(response, "User logged in successfully", {
      token: token,
    });
  };

  logout = async (request: IRequest, response: IResponse) => {
    response.clearCookie("token");

    this.success(response, "User logged out successfully");
  };

  check = async (request: IRequest, response: IResponse) => {
    const user = await User.findOne({
      where: {
        id: request.user.id,
      },
      attributes: ["id", "name", "email", "is_system_admin"],
      include: [
        {
          model: Entity,
          required: false,
          as: "entities",
          include: [
            {
              model: EntityType,
              required: false,
              as: "type",
            },
          ],
        },
      ],
    });

    return this.success(response, "", user);
  };

  store = async (request: IRequest, response: IResponse) => {
    const { error } = addUserSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    User.create({
      is_system_admin: request.body.is_system_admin,
      name: request.body.name,
      email: request.body.email,
      password: await bcrypt.hash(request.body.password, 10),
    });

    this.success(response, "User has been added successfully");
  };

  update = async (request: IRequest, response: IResponse) => {
    const user = await User.findOne({
      where: {
        id: request.params.id,
      },
    });

    if (!user) return this.failed(response, "User not found");

    const { error } = updateUserSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    user.update({
      is_system_admin: request.body.is_system_admin,
      name: request.body.name,
      email: request.body.email,
      password: request.body.password
        ? await bcrypt.hash(request.body.password, 10)
        : user.password,
    });

    return this.success(response, "User has been updated successfully");
  };

  delete = async (request: IRequest, response: IResponse) => {
    const { error } = deleteUsersSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    await User.destroy({
      where: {
        id: request.body.ids,
      },
    });

    return this.success(response, "Users has been deleted successfully");
  };
}
