import { NextFunction, Request, Response } from "express";

import { logger } from "../utils/logger";

export function erroring(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  logger.error(error);
  response.status(500).json({ message: "Internal Server Error" });
  return next();
}
