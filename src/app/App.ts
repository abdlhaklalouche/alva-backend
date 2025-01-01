import express, { Application } from "express";
import * as bodyParser from "body-parser";

import routes from "./Routes";
import database from "./Config/Database";

class App {
  public app: Application;
  public port: number;

  constructor(port: any) {
    this.app = express();
    this.port = process.env.PORT || port;

    this.establishDbConnection();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeRoutes() {
    routes(this.app);
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

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Application is listening on the port ${this.port}`);
    });
  }
}

export default App;
