import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import Controller from "./Controller";
import { Entity, EntityType } from "../Models";
import { addEntitySchema } from "../Validation/EntitySchema";

export default class EntitiesController extends Controller {
  all = async (request: IRequest, response: IResponse) => {
    const entities = await Entity.findAll({
      include: [
        {
          model: EntityType,
          required: false,
          as: "type",
        },
      ],
    });

    response.json(entities);
  };

  single = async (request: IRequest, response: IResponse) => {};

  store = async (request: IRequest, response: IResponse) => {
    const { error } = addEntitySchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    Entity.create({
      user_id: request.body.user_id,
      type_id: request.body.type_id,
      name: request.body.name,
    });

    this.success(response, "Entity has been added successfully");
  };

  update = async (request: IRequest, response: IResponse) => {};

  delete = async (request: IRequest, response: IResponse) => {};

  userAll = async (request: IRequest, response: IResponse) => {};

  userStore = async (request: IRequest, response: IResponse) => {};

  userUpdate = async (request: IRequest, response: IResponse) => {};

  userDelete = async (request: IRequest, response: IResponse) => {};
}
