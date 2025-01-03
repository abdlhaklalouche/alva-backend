import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import Controller from "./Controller";
import { EntityType } from "../Models";
import { updateEntityTypesSchema } from "../Validation/EntitySchema";
import { Op, Sequelize } from "sequelize";

export default class EntityTypesController extends Controller {
  all = async (request: IRequest, response: IResponse) => {
    const types = await EntityType.findAll({
      attributes: {
        include: [
          "id",
          ["id", "_id"],
          "name",
          "icon",
          [Sequelize.literal("false"), "is_new"],
        ],
      },
      order: [["id", "DESC"]],
    });

    response.json({
      data: types,
    });
  };

  update = async (request: IRequest, response: IResponse) => {
    const { error } = updateEntityTypesSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    const updatedRecords = request.body.types
      .filter((item: any) => item.is_new === false)
      .map((item: any) => item._id);

    await EntityType.destroy({
      where: {
        id: {
          [Op.notIn]: updatedRecords,
        },
      },
    });

    request.body.types.map((type: any) => {
      if (type.is_new) {
        EntityType.create({
          name: type.name,
          icon: type.icon,
        });
      } else {
        EntityType.findOne({
          where: {
            id: type._id,
          },
        }).then((rescord) => {
          rescord?.update({
            name: type.name,
            icon: type.icon,
          });
        });
      }
    });

    return this.success(response, "Types has been saved successfully");
  };
}
