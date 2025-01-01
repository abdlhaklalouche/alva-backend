import { Request, Response } from "express";
import Controller from "./Controller";
import { Entity, User } from "../Models";
import { addUserSchema } from "../Validation/UserSchema";
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

  store = async (request: Request, response: Response) => {
    const { error, value } = addUserSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    User.create({
      name: request.body.name,
      email: request.body.email,
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

    const { error, value } = addUserSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    user.update({
      name: request.body.name,
      email: request.body.email,
      password: bcrypt(request.body.password),
    });

    return this.success(response, "User has been updated successfully");
  };

  delete = async (request: Request, response: Response) => {};
}
