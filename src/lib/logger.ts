import winston, { createLogger, format } from 'winston';
import 'winston-daily-rotate-file';
import { v4 as uuidv4 } from 'uuid';

const { combine, timestamp, errors, json } = format;

const transport = new winston.transports.DailyRotateFile({
  filename: './logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

export const logOption = {
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [transport],
} as winston.LoggerOptions;

export class Logger {
  logger: winston.Logger;
  constructor() {
    this.logger = createLogger(logOption).child({ pid: uuidv4() });
  }
}
