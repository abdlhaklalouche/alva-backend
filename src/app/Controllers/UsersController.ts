import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import Controller from "./Controller";
import { Entity, User } from "../Models";
import {
  addUserSchema,
  deleteUsersSchema,
  loginUserSchema,
} from "../Validation/UserSchema";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class UsersController extends Controller {
  all = async (request: IRequest, response: IResponse) => {
    const users = await User.findAll({
      include: [
        {
          model: Entity,
          required: false,
        },
      ],
      attributes: ["id", "name", "email"],
    });

    response.json(users);
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

    this.success(response, "User logged in successfully", {
      token: token,
    });
  };

  check = async (request: IRequest, response: IResponse) => {
    const user = await User.findOne({
      where: {
        id: request.user.id,
      },
    });

    response.json(request.user);
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

    const { error } = addUserSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    user.update({
      is_system_admin: request.body.is_system_admin,
      name: request.body.name,
      email: request.body.email,
      password: await bcrypt.hash(request.body.password, 10),
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
