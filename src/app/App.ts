import express, { Application } from "express";
import * as bodyParser from "body-parser";
import dotenv from "dotenv";
import routes from "./Routes";

class App {
  public app: Application;
  public port: number;

  constructor(port: any) {
    dotenv.config();

    this.app = express();
    this.port = process.env.PORT || port;

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeRoutes() {
    routes(this.app);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Application is listening on the port ${this.port}`);
    });
  }
}

export default App;
