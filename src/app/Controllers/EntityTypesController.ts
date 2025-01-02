import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import Controller from "./Controller";
import { EntityType } from "../Models";
import { updateEntityTypesSchema } from "../Validation/EntitySchema";

export default class EntityTypesController extends Controller {
  all = async (request: IRequest, response: IResponse) => {
    const types = await EntityType.findAll();

    response.json(types);
  };

  update = async (request: IRequest, response: IResponse) => {
    const { error } = updateEntityTypesSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    return this.success(response, "Types has been saved successfully");
  };
}
