import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'error',
      filename: './logs/error.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.File({
      level: 'info',
      filename: './logs/combined.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: false,
    }),
  ],
  exitOnError: false,
});

export default {
  write: (message) => {
    logger.info((message || '').trim());
  },
};
