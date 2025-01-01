import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { name, user, password, host, port, dbLogging } = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  name: process.env.DB_NAME || "",
  dbLogging: process.env.NODE_ENV === "development",
};

const database = new Sequelize(name, user, password, {
  host: host,
  dialect: "postgres",
  logging: dbLogging,
});

export default database;
