import "dotenv/config";

import cookieParser from "cookie-parser";
import express from "express";

import { erroring } from "./middleware/error";
import { logging } from "./middleware/logging";
import { deserializeUser } from "./middleware/user";
import { router as authRouter } from "./routes/auth";
import { router as testRouter } from "./routes/test";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(logging);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(deserializeUser);

app.use("/auth", authRouter);
app.use("/test", testRouter);

app.use(erroring);

app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
});
