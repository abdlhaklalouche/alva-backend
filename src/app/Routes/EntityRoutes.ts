import express, { Router } from "express";
import IRoutes from "../Interfaces/IRoutes";
import EntitiesController from "../Controllers/EntitiesController";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import SysAdminMiddleware from "../Middlewares/SysAdminMiddleware";
import EntityTypesController from "../Controllers/EntityTypesController";

export default class EntityRoutes implements IRoutes {
  public router: Router;

  private controller: EntitiesController = new EntitiesController();
  private typesController: EntityTypesController = new EntityTypesController();
  private auth: AuthMiddleware = new AuthMiddleware();
  private sysAdmin: SysAdminMiddleware = new SysAdminMiddleware();

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  //prettier-ignore
  registerRoutes(): void {
    this.router.get("/u", this.auth.handle(), this.controller.userAll);
    this.router.put("/u", this.auth.handle(), this.controller.userStore);
    this.router.patch("/u/:id", this.auth.handle(), this.controller.userUpdate);
    this.router.post("/u/delete", this.auth.handle(), this.controller.userDelete);

    // System Admin Actions
    
    this.router.get("/types", [this.auth.handle(), this.sysAdmin.handle()], this.typesController.all);
    this.router.patch("/types", [this.auth.handle(), this.sysAdmin.handle()], this.typesController.update);

    this.router.get("/", [this.auth.handle(), this.sysAdmin.handle()], this.controller.all);
    this.router.get("/:id", [this.auth.handle(), this.sysAdmin.handle()], this.controller.single);
    this.router.put("/", [this.auth.handle(), this.sysAdmin.handle()], this.controller.store);
    this.router.patch("/:id", [this.auth.handle(), this.sysAdmin.handle()], this.controller.update);
    this.router.post("/delete", [this.auth.handle(), this.sysAdmin.handle()], this.controller.delete);
  }
}
