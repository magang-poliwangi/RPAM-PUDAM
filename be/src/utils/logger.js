import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const isProd = process.env.NODE_ENV === 'production';
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    const { method, url, statusCode, userId, ...rest } = meta;

    let line = `[${timestamp}] ${level}:`;

    if (method && url) {
      line += ` ${method} ${url}`;
      if (statusCode) line += ` → ${statusCode}`;
      if (userId) line += ` (user: ${userId})`;
      line += `\n  ${message}`;
    } else {
      line += ` ${message}`;
    }

    if (stack) line += `\n${stack}`;

    const extras = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v && Object.keys(v).length > 0)
    );
    if (Object.keys(extras).length > 0) {
      line += `\n  context: ${JSON.stringify(extras)}`;
    }

    return line;
  }),
);

const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: fileFormat,
    }),
  ],
  exitOnError: false,
});

export default logger;