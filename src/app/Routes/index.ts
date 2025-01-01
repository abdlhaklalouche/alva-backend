import { Application } from "express";
import UserRoutes from "./UserRoutes";
import EntityRoutes from "./EntityRoutes";
import DeviceRoutes from "./DeviceRoutes";

const routes = (app: Application): void => {
  app.use("/users", new UserRoutes().router);
  app.use("/entities", new EntityRoutes().router);
  app.use("/devices", new DeviceRoutes().router);
};

export default routes;
