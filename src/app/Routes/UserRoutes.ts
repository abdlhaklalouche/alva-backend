import express, { Router } from "express";
import UsersController from "../Controllers/UsersController";
import IRoutes from "../Interfaces/IRoutes";

export default class UserRoutes implements IRoutes {
  public router: Router;

  private controller: UsersController = new UsersController();

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.get("/", this.controller.all);
    this.router.put("/", this.controller.store);
    this.router.patch("/:id", this.controller.update);
    this.router.post("/delete", this.controller.delete);
  }
}
