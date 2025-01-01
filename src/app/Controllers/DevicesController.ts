import { Request, Response } from "express";
import Controller from "./Controller";
import { Device } from "../Models";

export default class DevicesController extends Controller {
  all = async (request: Request, response: Response) => {
    const users = await Device.findAll();

    response.json(users);
  };

  store = async (request: Request, response: Response) => {};

  update = async (request: Request, response: Response) => {};

  delete = async (request: Request, response: Response) => {};
}
