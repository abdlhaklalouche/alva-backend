import express, { Router } from "express";
import IRoutes from "../Interfaces/IRoutes";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import SysAdminMiddleware from "../Middlewares/SysAdminMiddleware";
import RoomsController from "../Controllers/RoomsController";

export default class RoomRoutes implements IRoutes {
  public router: Router;

  private controller: RoomsController = new RoomsController();
  private auth: AuthMiddleware = new AuthMiddleware();
  private sysAdmin: SysAdminMiddleware = new SysAdminMiddleware();

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  //prettier-ignore
  registerRoutes(): void {
    this.router.get("/u/", this.auth.handle(), this.controller.userAll);
    this.router.put("/u/", this.auth.handle(), this.controller.userStore);
    this.router.patch("/u/:id", this.auth.handle(), this.controller.userUpdate);
    this.router.post("/u/delete", this.auth.handle(), this.controller.userDelete);

    // System Admin Actions
    this.router.get("/:id", [this.auth.handle(), this.sysAdmin.handle()], this.controller.single);
    this.router.patch("/:id", [this.auth.handle(), this.sysAdmin.handle()], this.controller.update);
  }
}
