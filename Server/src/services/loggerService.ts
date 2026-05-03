import pino from "pino";
import type { ActionLog } from "../types/logs.js";
import { LogSeverity } from "../types/logs.js";

const pinoLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: {
    paths: [
      "env",
      "*.env",
      "metadata.env",
      "metadata.*.env",
      "metadata.body.env",
      "request_context.env",
      "request_context.*.env",
      "password",
      "*.password",
      "metadata.password",
      "token",
      "*.token",
      "metadata.token",
      "accessToken",
      "refreshToken",
      "authorization",
      "cookie",
      "secret",
      "secretKey",
      "apiKey",
      "api_key",
      "treatment_data.*",
      '"metadata.treatment_data*"',
    ],
    censor: "[REDACTED]",
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
});

const LoggerService = {
  /**
   * At this point, this service only prints to the console using Pino.
   * Later, this will be extended to save logs to the database.
   */
  async print(log: ActionLog) {
    const { action, ...details } = log;

    if (log.severity === LogSeverity.ERROR) {
      pinoLogger.error(details, action);
    } else {
      pinoLogger.info(details, action);
    }
  },
};

export { pinoLogger };
export default LoggerService;
