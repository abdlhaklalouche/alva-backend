import express, { Router } from "express";
import IRoutes from "../Interfaces/IRoutes";
import DevicesController from "../Controllers/DevicesController";

export default class DeviceRoutes implements IRoutes {
  public router: Router;

  private controller: DevicesController = new DevicesController();

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.get("/", this.controller.all);
    this.router.put("/", this.controller.store);
    this.router.patch("/:id", this.controller.update);
    this.router.post("/delete/:id", this.controller.delete);
  }
}
