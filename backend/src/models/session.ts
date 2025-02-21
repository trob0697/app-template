import { CookieOptions } from "express";

const ENV = process.env.ENV!;
const CLIENT_URL = process.env.CLIENT_URL!;

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  sameSite: "lax",
  domain:
    ENV === "PRODUCTION" ? CLIENT_URL.replace("https://www", "") : undefined,
  maxAge: 3.6e6, // 1 hour
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  ...ACCESS_TOKEN_COOKIE_OPTIONS,
  maxAge: 6.048e8, // 7 days
};

export const DELETE_COOKIE_OPTIONS: CookieOptions = {
  ...ACCESS_TOKEN_COOKIE_OPTIONS,
  maxAge: 0,
};

export type GoogleToken = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
};

export type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};
