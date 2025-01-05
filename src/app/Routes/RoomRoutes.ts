import express, { Router } from "express";
import IRoutes from "../Interfaces/IRoutes";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import IApplication from "../Interfaces/IApplication";
import RoomsController from "../Controllers/RoomsController";

export default class RoomRoutes implements IRoutes {
  public router: Router;
  public app: IApplication;

  private controller: RoomsController;
  private auth: AuthMiddleware = new AuthMiddleware();

  constructor(app: IApplication) {
    this.app = app;
    this.router = express.Router();

    this.controller = new RoomsController(app);

    this.registerRoutes();
  }

  //prettier-ignore
  registerRoutes(): void {
    this.router.get("/u", this.auth.handle(), this.controller.userAll);
  }
}
