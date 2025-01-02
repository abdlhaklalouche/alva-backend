import express, { Router } from "express";
import UsersController from "../Controllers/UsersController";
import IRoutes from "../Interfaces/IRoutes";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import GuestMiddleware from "../Middlewares/GuestMiddleware";

export default class UserRoutes implements IRoutes {
  public router: Router;

  private controller: UsersController = new UsersController();
  private auth: AuthMiddleware = new AuthMiddleware();
  private guest: GuestMiddleware = new GuestMiddleware();

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.get("/", this.auth.handle(), this.controller.all);
    this.router.put("/", this.auth.handle(), this.controller.store);
    this.router.patch("/:id", this.auth.handle(), this.controller.update);
    this.router.post("/delete", this.auth.handle(), this.controller.delete);
    // Authentication
    this.router.post("/login", this.guest.handle(), this.controller.login);
    this.router.post("/check", this.auth.handle(), this.controller.check);
  }
}
