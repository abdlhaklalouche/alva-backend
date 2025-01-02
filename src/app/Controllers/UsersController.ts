import { Request, Response } from "express";
import Controller from "./Controller";
import { Entity, User } from "../Models";
import {
  addUserSchema,
  deleteUsersSchema,
  loginUserSchema,
} from "../Validation/UserSchema";
import bcrypt from "bcrypt";

export default class UsersController extends Controller {
  all = async (request: Request, response: Response) => {
    const users = await User.findAll({
      include: [
        {
          model: Entity,
          required: false,
        },
      ],
    });

    response.json(users);
  };

  login = async (request: Request, response: Response) => {
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

    this.success(response, "User logged in successfully", {
      token: "",
    });
  };

  check = async (request: Request, response: Response) => {};

  logout = async (request: Request, response: Response) => {};

  store = async (request: Request, response: Response) => {
    const { error } = addUserSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    User.create({
      name: request.body.name,
      email: request.body.email,
      password: await bcrypt.hash(request.body.password, 10),
    });

    this.success(response, "User has been added successfully");
  };

  update = async (request: Request, response: Response) => {
    const user = await User.findOne({
      where: {
        id: request.params.id,
      },
    });

    if (!user) return this.failed(response, "User not found");

    const { error } = addUserSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    user.update({
      name: request.body.name,
      email: request.body.email,
      password: await bcrypt.hash(request.body.password, 10),
    });

    return this.success(response, "User has been updated successfully");
  };

  delete = async (request: Request, response: Response) => {
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
