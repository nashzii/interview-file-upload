import winston, { createLogger, format, transports } from 'winston';
import { v4 as uuidv4 } from 'uuid';

const { combine, timestamp, errors, json } = format;

export const logOption = {
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [new transports.Console()],
} as winston.LoggerOptions;

export class Logger {
  logger: winston.Logger;
  constructor() {
    this.logger = createLogger(logOption).child({ pid: uuidv4() });
  }
}
