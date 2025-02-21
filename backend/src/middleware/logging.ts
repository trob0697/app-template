import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

import { logger } from "../utils/logger";

export function logging(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const start = performance.now();
  const url = request.url;
  logger.defaultMeta = { traceId: randomUUID() };
  logger.info(`${request.method} ${url} called`);
  response.on("finish", () => {
    const end = performance.now() - start;
    logger.info(
      `${request.method} ${url} ${response.statusCode} finished in ${end}`,
    );
  });
  return next();
}
