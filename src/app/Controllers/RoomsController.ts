import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import { Entity, Room } from "../Models";
import Controller from "./Controller";
import IApplication from "../Interfaces/IApplication";

export default class RoomsController extends Controller {
  public app: IApplication;

  constructor(app: IApplication) {
    super();
    this.app = app;
  }

  userAll = async (request: IRequest, response: IResponse) => {
    const devices = await Room.findAll({
      include: [
        {
          model: Entity,
          required: true,
          as: "entity",
          where: {
            user_id: request.user.id,
          },
        },
      ],
      order: [["id", "DESC"]],
    });

    response.json({
      data: devices,
    });
  };
}
