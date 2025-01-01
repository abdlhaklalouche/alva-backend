import express, { Application } from "express";
import UserRoutes from "./UserRoutes";

const routes = (app: Application): void => {
  app.use("/", new UserRoutes().router);
};

export default routes;
