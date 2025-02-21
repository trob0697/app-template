import * as winston from "winston";

const ENV = process.env.ENV!;

const GCP_LEVELS = {
  error: 3,
  warn: 4,
  info: 6,
  verbose: 7,
  debug: 7,
  silly: 7,
};

const PRODUCTION_FORMAT = winston.format.combine(
  winston.format.printf((info) =>
    JSON.stringify({
      severity: info.level.toUpperCase(),
      message: info.message,
      metadata: info.metadata,
      httpRequest: info.httpRequest,
      httpResponse: info.httpResponse,
      stack_trace: info.stack,
      ["logging.googleapis.com/trace"]: info.traceId,
    }),
  ),
);

const DEVELOPMENT_FORMAT = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.colorize(),
  winston.format.printf(
    ({ timestamp, traceId, level, message, stack }) =>
      `[${timestamp}] [${traceId}] ${level}: ${message} ${stack ? `\n${stack}` : ""}`,
  ),
);

function constructLogger(): winston.Logger {
  return winston.createLogger({
    level: "info",
    levels: GCP_LEVELS,
    transports: [
      new winston.transports.Console({
        stderrLevels: [],
      }),
    ],
    format: ENV === "PRODUCTION" ? PRODUCTION_FORMAT : DEVELOPMENT_FORMAT,
  });
}

export const logger = constructLogger();
