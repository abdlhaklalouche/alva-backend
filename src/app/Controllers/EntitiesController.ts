import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import Controller from "./Controller";
import { Entity, EntityType } from "../Models";

export default class EntitiesController extends Controller {
  all = async (request: IRequest, response: IResponse) => {
    const entities = await Entity.findAll({
      include: [
        {
          model: EntityType,
          required: false,
        },
      ],
    });

    response.json(entities);
  };

  single = async (request: IRequest, response: IResponse) => {};

  store = async (request: IRequest, response: IResponse) => {};

  update = async (request: IRequest, response: IResponse) => {};

  delete = async (request: IRequest, response: IResponse) => {};

  userAll = async (request: IRequest, response: IResponse) => {};

  userStore = async (request: IRequest, response: IResponse) => {};

  userUpdate = async (request: IRequest, response: IResponse) => {};

  userDelete = async (request: IRequest, response: IResponse) => {};
}
