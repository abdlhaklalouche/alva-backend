import { Request, Response } from "express";
import Controller from "./Controller";

export default class UsersController extends Controller {
  getUsers = async (request: Request, response: Response) => {
    this.success(response);
  };
}
