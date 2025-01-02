import IRequest from "../Interfaces/IRequest";
import IResponse from "../Interfaces/IResponse";
import Controller from "./Controller";
import { Device } from "../Models";

export default class RoomsController extends Controller {
  single = async (request: IRequest, response: IResponse) => {};

  update = async (request: IRequest, response: IResponse) => {};

  userAll = async (request: IRequest, response: IResponse) => {};

  userStore = async (request: IRequest, response: IResponse) => {};

  userUpdate = async (request: IRequest, response: IResponse) => {};

  userDelete = async (request: IRequest, response: IResponse) => {};
}
