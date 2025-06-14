import {
    createLogger,
    format,
    Logger,
    LoggerOptions,
    transports,
} from "winston";
import DailyRotateFile, {
    DailyRotateFileTransportOptions,
} from "winston-daily-rotate-file";
import { NodeEnvironments } from "./constants";

const NODE_ENV: string | undefined = process.env.NODE_ENV;

const dailyRotateTransport: DailyRotateFile = new DailyRotateFile({
    filename: "logs/log-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20M",
    maxFiles: "15d",
} as DailyRotateFileTransportOptions);

export const logger: Logger = createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    transports:
        NODE_ENV === NodeEnvironments.PRODUCITION
            ? [dailyRotateTransport]
            : [
                  dailyRotateTransport,
                  new transports.Console({ level: "debug" }),
              ],
} as LoggerOptions);
