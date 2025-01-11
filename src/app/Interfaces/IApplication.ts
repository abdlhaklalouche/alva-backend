import { Application } from "express";
import http from "http";
import { Server, Socket } from "socket.io";

export default interface IApplication {
  server: http.Server;
  app: Application;
  io: Server;
  port: number;
}
