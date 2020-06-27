import env from './env';

const whitelist = [
  `${env.APP_PROTOCOL}://${env.APP_URL}`,
];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (origin === undefined || origin === 'null' || origin === null) {
      origin = `${env.APP_PROTOCOL}://${env.APP_URL}`;
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback('Not allowed by CORS');
    }
  },
  exposedHeaders: ['Content-Length', 'Authorization', 'X-REFRESH-TOKEN'],
};

export default corsOptions;
