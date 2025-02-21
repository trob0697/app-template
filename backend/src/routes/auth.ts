import express from "express";
import jwt from "jsonwebtoken";
import Joi from "types-joi";

import { controller } from "../common";
import { findAndUpdateOrInsertUser } from "../db/tables/users";
import { generateRedirectUrl } from "../middleware/google";
import * as SessionModel from "../models/session";
import { logger } from "../utils/logger";

export const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL!;
const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID!;
const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

//////////////////////////////////////////////////
///// ROUTES

router.get("/google", [generateRedirectUrl], getAuthGoogleController());
router.post("/logout", postAuthLogoutController());

//////////////////////////////////////////////////
///// CONTROLLERS

function getAuthGoogleController() {
  return controller(
    {
      query: Joi.object({
        code: Joi.string().required(),
        scope: Joi.string().required(),
        authuser: Joi.string().required(),
        prompt: Joi.string().required(),
        redirectUrl: Joi.string().required(),
      }),
    },
    async ({ query }) => {
      logger.info("Fetching google oauth token");
      const googleToken = await getGoogleOauthToken({
        code: query.code,
        redirectUrl: query.redirectUrl,
      });
      logger.info("Fetching google user");
      const googleUser = await getGoogleUser({
        idToken: googleToken.id_token,
        accessToken: googleToken.access_token,
      });

      if (!googleUser.verified_email) {
        logger.error("Google account is not verified");
        return {
          body: {
            message: "Your Google account is not verified.",
          },
          status: 403,
        };
      }

      logger.info("Finding/updating or creating user");
      const user = await findAndUpdateOrInsertUser({
        googleUser,
      });

      logger.info("Generating access and refresh tokens");
      const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      return {
        redirect: `${CLIENT_URL}/dashboard`,
        cookies: [
          {
            name: "accessToken",
            value: accessToken,
            options: SessionModel.ACCESS_TOKEN_COOKIE_OPTIONS,
          },
          {
            name: "refreshToken",
            value: refreshToken,
            options: SessionModel.REFRESH_TOKEN_COOKIE_OPTIONS,
          },
        ],
      };
    },
  );
}

function postAuthLogoutController() {
  return controller({}, async () => {
    return {
      body: { message: "Logout Successful" },
      cookies: [
        {
          name: "accessToken",
          value: "",
          options: SessionModel.DELETE_COOKIE_OPTIONS,
        },
        {
          name: "refreshToken",
          value: "",
          options: SessionModel.DELETE_COOKIE_OPTIONS,
        },
      ],
    };
  });
}

//////////////////////////////////////////////////
///// HELPERS

async function getGoogleOauthToken(args: {
  code: string;
  redirectUrl: string;
}): Promise<SessionModel.GoogleToken> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: args.code,
        client_id: GOOGLE_OAUTH_CLIENT_ID,
        client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: args.redirectUrl,
        grant_type: "authorization_code",
      }).toString(),
    });
    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(responseBody));
    }
    return responseBody as SessionModel.GoogleToken;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
}

async function getGoogleUser(args: {
  idToken: string;
  accessToken: string;
}): Promise<SessionModel.GoogleUser> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${args.accessToken}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${args.idToken}`,
        },
      },
    );
    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(responseBody));
    }
    return responseBody as SessionModel.GoogleUser;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
}
