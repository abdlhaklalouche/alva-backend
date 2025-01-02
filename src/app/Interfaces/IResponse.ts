import { Response } from "express";

export default interface IResponse extends Response {
  user?: any;
}
