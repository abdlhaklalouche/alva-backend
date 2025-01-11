import express, { Router } from "express";
import IRoutes from "../Interfaces/IRoutes";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import IApplication from "../Interfaces/IApplication";
import InsightsController from "../Controllers/InsightsController";

export default class InsightsRoutes implements IRoutes {
  public router: Router;
  public app: IApplication;

  private controller: InsightsController;
  private auth: AuthMiddleware;

  constructor(app: IApplication) {
    this.app = app;
    this.router = express.Router();

    this.auth = new AuthMiddleware(app);

    this.controller = new InsightsController(app);

    this.registerRoutes();
  }

  //prettier-ignore
  registerRoutes(): void {
    this.router.get("/", this.auth.handle(), this.controller.insights);
    this.router.get("/dashboard", this.auth.handle(), this.controller.dashboard);
  }
}
