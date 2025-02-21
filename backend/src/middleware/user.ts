import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../db/tables/users";
import { ACCESS_TOKEN_COOKIE_OPTIONS } from "../models/session";
import { logger } from "../utils/logger";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function deserializeUser(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const accessToken: string | null = request.cookies.accessToken || null;
  const refreshToken: string | null = request.cookies.refreshToken || null;

  if (!accessToken) return next();
  try {
    const user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as User;
    response.locals.user = user;
    return next();
  } catch {
    logger.warn("Failed to verify access token... Clearing cookie");
    response.clearCookie("accessToken");
  }

  if (!refreshToken) return next();
  try {
    const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as User;
    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
      algorithm: "RS256",
    });
    response.locals.user = user;
    response.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  } catch {
    logger.warn("Failed to verify refresh token... Clearing cookie");
    response.clearCookie("refreshToken");
  }

  return next();
}

export function requireUser(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const user = response.locals.user as User;
  if (!user) {
    logger.error("A user was not provided for this request");
    response.sendStatus(403);
    return;
  }
  request.query.userId = user.id;
  return next();
}
