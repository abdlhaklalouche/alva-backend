import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import { Request, Response } from "express";
import Controller from "./Controller";
import { Entity } from "../Models";

export default class EntitiesController extends Controller {
  all = async (request: IRequest, response: IResponse) => {
    const users = await Entity.findAll();

    response.json(users);
  };

  store = async (request: IRequest, response: IResponse) => {};

  update = async (request: IRequest, response: IResponse) => {};

  delete = async (request: IRequest, response: IResponse) => {};

  userAll = async (request: IRequest, response: IResponse) => {};

  userStore = async (request: IRequest, response: IResponse) => {};

  userUpdate = async (request: IRequest, response: IResponse) => {};

  userDelete = async (request: IRequest, response: IResponse) => {};
}
