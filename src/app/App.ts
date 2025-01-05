import express, { Application } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import dontenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import routes from "./Routes";
import database from "./Config/Database";
import IApplication from "./Interfaces/IApplication";

class App implements IApplication {
  public server: http.Server;
  public app: Application;
  public io: Server;
  public port: number;

  constructor(port: any) {
    dontenv.config();

    this.app = express();
    this.port = process.env.PORT || port;

    this.server = http.createServer(this.app);

    this.io = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.establishDbConnection();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.listenToSocket();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());

    this.app.use(
      cors({
        origin: process.env.PORTAL_URL,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
      })
    );
  }

  private initializeRoutes() {
    routes(this);
  }

  private async establishDbConnection() {
    try {
      await database.authenticate();
      await database.sync();

      console.log(`Connection has been established successfully.`);
    } catch (error) {
      console.log(`Unable to connect to the database: ${error}`);
    }
  }

  private listenToSocket() {
    this.io.on("connection", (socket) => {
      socket.on("message", (data) => {});

      socket.on("disconnect", () => {});
    });
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`Application is listening on the port ${this.port}`);
    });
  }
}

export default App;
