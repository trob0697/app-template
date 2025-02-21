import { NextFunction, Request, Response } from "express";

const ENV = process.env.ENV!;

export function generateRedirectUrl(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  request.query.redirectUrl = `http${ENV === "PRODUCTION" ? "s" : ""}://${request.get("host")}${request.originalUrl.split("?")[0]}`;
  return next();
}
