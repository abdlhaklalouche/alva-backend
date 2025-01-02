import express, { Router } from "express";
import IRoutes from "../Interfaces/IRoutes";
import DevicesController from "../Controllers/DevicesController";
import AuthMiddleware from "../Middlewares/AuthMiddleware";

export default class DeviceRoutes implements IRoutes {
  public router: Router;

  private controller: DevicesController = new DevicesController();
  private auth: AuthMiddleware = new AuthMiddleware();

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.get("/", this.auth.handle(), this.controller.all);
    this.router.put("/", this.auth.handle(), this.controller.store);
    this.router.patch("/:id", this.auth.handle(), this.controller.update);
    this.router.post("/delete", this.auth.handle(), this.controller.delete);
  }
}
