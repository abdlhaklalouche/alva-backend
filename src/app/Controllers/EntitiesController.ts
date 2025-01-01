import { Request, Response } from "express";
import Controller from "./Controller";
import { Entity } from "../Models";

export default class EntitiesController extends Controller {
  all = async (request: Request, response: Response) => {
    const users = await Entity.findAll();

    response.json(users);
  };

  store = async (request: Request, response: Response) => {};

  update = async (request: Request, response: Response) => {};

  delete = async (request: Request, response: Response) => {};
}
