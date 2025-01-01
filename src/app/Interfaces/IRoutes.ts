import { Response, Router } from "express";

export default interface IRoutes {
  router: Router;
  registerRoutes(): void;
}
