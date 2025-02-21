import express from "express";

import { controller } from "../common";
import { logger } from "../utils/logger";

export const router = express.Router();

//////////////////////////////////////////////////
///// ROUTES

router.get("/", getTestController());
router.get("/error", getTestErrorController());

//////////////////////////////////////////////////
///// CONTROLLERS

function getTestController() {
  return controller({}, async () => {
    logger.info("This is a test log");
    return {
      body: { message: "this is a test" },
    };
  });
}

function getTestErrorController() {
  return controller({}, async () => {
    throw new Error("This is a test error");
  });
}
