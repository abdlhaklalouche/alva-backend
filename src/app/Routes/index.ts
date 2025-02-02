import UserRoutes from "./UserRoutes";
import EntityRoutes from "./EntityRoutes";
import DeviceRoutes from "./DeviceRoutes";
import IApplication from "../Interfaces/IApplication";
import RoomRoutes from "./RoomRoutes";
import InsightsRoutes from "./InsightsRoutes";

const routes = (app: IApplication): void => {
  app.app.use("/users", new UserRoutes(app).router);
  app.app.use("/entities", new EntityRoutes(app).router);
  app.app.use("/devices", new DeviceRoutes(app).router);
  app.app.use("/rooms", new RoomRoutes(app).router);
  app.app.use("/insights", new InsightsRoutes(app).router);
};

export default routes;
