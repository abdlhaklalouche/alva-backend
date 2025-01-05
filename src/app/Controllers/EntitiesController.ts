import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import Controller from "./Controller";
import { Entity, EntityType, Room, User } from "../Models";
import {
  addEntitySchema,
  addUserEntitySchema,
  deleteEntitiesSchema,
  updateEntitySchema,
} from "../Validation/EntitySchema";
import { Op, Sequelize } from "sequelize";
import IApplication from "../Interfaces/IApplication";

export default class EntitiesController extends Controller {
  public app: IApplication;

  constructor(app: IApplication) {
    super();
    this.app = app;
  }

  all = async (request: IRequest, response: IResponse) => {
    const entities = await Entity.findAll({
      include: [
        {
          model: EntityType,
          required: false,
          as: "type",
        },
        {
          model: User,
          required: false,
          as: "user",
        },
        {
          model: Room,
          required: false,
          as: "rooms",
          attributes: {
            include: [
              "id",
              ["id", "_id"],
              "name",
              [Sequelize.literal("false"), "is_new"],
            ],
          },
          order: [["id", "DESC"]],
        },
      ],
      order: [["id", "DESC"]],
    });

    response.json({
      data: entities,
    });
  };

  store = async (request: IRequest, response: IResponse) => {
    const { error } = addEntitySchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    const entity = await Entity.create({
      user_id: request.body.user.id,
      type_id: request.body.type.id,
      name: request.body.name,
    });

    request.body.rooms.map((room: any) => {
      Room.create({
        name: room.name,
        entity_id: entity.id,
      });
    });

    this.success(response, "Entity has been added successfully");
  };

  update = async (request: IRequest, response: IResponse) => {
    this.app.io.emit("receive_message", "Hello");

    const entity = await Entity.findOne({
      where: {
        id: request.params.id,
      },
    });

    if (!entity) return this.failed(response, "Entity not found");

    const { error } = updateEntitySchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    await entity.update({
      user_id: request.body.user.id,
      type_id: request.body.type.id,
      name: request.body.name,
    });

    const updatedRecords = request.body.rooms
      .filter((item: any) => item.is_new === false)
      .map((item: any) => item._id);

    await Room.destroy({
      where: {
        id: {
          [Op.notIn]: updatedRecords,
        },
      },
    });

    request.body.rooms.map((room: any) => {
      if (room.is_new) {
        Room.create({
          entity_id: entity.id,
          name: room.name,
        });
      } else {
        Room.findOne({
          where: {
            id: room._id,
          },
        }).then((rescord) => {
          rescord?.update({
            name: room.name,
          });
        });
      }
    });

    this.success(response, "Entity has been updated successfully");
  };

  delete = async (request: IRequest, response: IResponse) => {
    const { error } = deleteEntitiesSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    await Entity.destroy({
      where: {
        id: request.body.ids,
      },
    });

    return this.success(response, "Entities has been deleted successfully");
  };

  userAll = async (request: IRequest, response: IResponse) => {
    const entities = await Entity.findAll({
      include: [
        {
          model: EntityType,
          required: false,
          as: "type",
        },
        {
          model: User,
          required: false,
          as: "user",
        },
        {
          model: Room,
          required: false,
          as: "rooms",
          attributes: {
            include: [
              "id",
              ["id", "_id"],
              "name",
              [Sequelize.literal("false"), "is_new"],
            ],
          },
          order: [["id", "DESC"]],
        },
      ],
      where: {
        user_id: request.user.id,
      },
      order: [["id", "DESC"]],
    });

    response.json({
      data: entities,
    });
  };

  userStore = async (request: IRequest, response: IResponse) => {
    const { error } = addUserEntitySchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    const entity = await Entity.create({
      type_id: request.body.type.id,
      name: request.body.name,
    });

    request.body.rooms.map((room: any) => {
      Room.create({
        name: room.name,
        entity_id: entity.id,
      });
    });

    this.success(response, "Entity has been added successfully");
  };

  userUpdate = async (request: IRequest, response: IResponse) => {
    const entity = await Entity.findOne({
      where: {
        id: request.params.id,
        user_id: request.user.id,
      },
    });

    if (!entity) return this.failed(response, "Entity not found");

    const { error } = updateEntitySchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    await entity.update({
      type_id: request.body.type.id,
      name: request.body.name,
    });

    const updatedRecords = request.body.rooms
      .filter((item: any) => item.is_new === false)
      .map((item: any) => item._id);

    await Room.destroy({
      where: {
        id: {
          [Op.notIn]: updatedRecords,
        },
      },
    });

    request.body.rooms.map((room: any) => {
      if (room.is_new) {
        Room.create({
          entity_id: entity.id,
          name: room.name,
        });
      } else {
        Room.findOne({
          where: {
            id: room._id,
          },
        }).then((rescord) => {
          rescord?.update({
            name: room.name,
          });
        });
      }
    });

    this.success(response, "Entity has been updated successfully");
  };

  userDelete = async (request: IRequest, response: IResponse) => {
    const { error } = deleteEntitiesSchema.validate(request.body);

    if (error) return this.failed(response, error.message, error.details);

    await Entity.destroy({
      where: {
        id: request.body.ids,
        user_id: request.user.id,
      },
    });

    return this.success(response, "Entities has been deleted successfully");
  };
}
