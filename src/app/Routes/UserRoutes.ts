import express, { Router } from "express";
import UsersController from "../Controllers/UsersController";
import IRoutes from "../Interfaces/IRoutes";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import GuestMiddleware from "../Middlewares/GuestMiddleware";
import SysAdminMiddleware from "../Middlewares/SysAdminMiddleware";
import IApplication from "../Interfaces/IApplication";

export default class UserRoutes implements IRoutes {
  public router: Router;
  public app: IApplication;

  private controller: UsersController;
  private auth: AuthMiddleware;
  private guest: GuestMiddleware;
  private sysAdmin: SysAdminMiddleware;

  constructor(app: IApplication) {
    this.app = app;
    this.router = express.Router();

    this.auth = new AuthMiddleware(app);
    this.guest = new GuestMiddleware(app);
    this.sysAdmin = new SysAdminMiddleware(app);

    this.controller = new UsersController(this.app);

    this.registerRoutes();
  }

  //prettier-ignore
  registerRoutes(): void {
    this.router.post("/login", this.guest.handle(), this.controller.login);
    this.router.post("/check", this.auth.handle(), this.controller.check);
    this.router.post("/logout", this.auth.handle(), this.controller.logout);
    this.router.patch("/account", this.auth.handle(), this.controller.account);
    
    // System Admin Actions

    this.router.get("/", [this.auth.handle(), this.sysAdmin.handle()], this.controller.all);
    this.router.put("/", [this.auth.handle(), this.sysAdmin.handle()], this.controller.store);
    this.router.patch("/:id", [this.auth.handle(), this.sysAdmin.handle()], this.controller.update);
    this.router.post("/delete", [this.auth.handle(), this.sysAdmin.handle()], this.controller.delete);
  }
}
