import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import winstonStream from './app/helpers/logger';
import routes from './app/routes';
import response from './app/helpers/response';
import env from './app/config/env';
import corsOptions from './app/config/cors';
import refreshTokenOnExpire from './app/middlewares/refreshTokenOnExpire';
import decodeUser from './app/middlewares/decodeUser';

config();

const { log } = console;

const app = express();

app.use(morgan('combined', { stream: winstonStream }));

app.use(helmet());
app.use(json());
app.use(
  cors(corsOptions),
);

app.use(cookieParser());
app.use(urlencoded({ extended: false }));

app.get('/', (req, res) => res.status(200)
  .send('<h1>Welcome to Edustripe authentication service!</h1>'));

app.use('/api/v1', decodeUser, refreshTokenOnExpire, routes);

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  return response.error(res, error.status || 500, error, error.message || 'Internal Server Error');
});

app.use('*', (req, res) => response.notFound(res));

/**
 * Function to normalize port
 * @param {string | number} val
 * @return {any | number} The normalized port
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    return val;
  }
  return port >= 0 ? port : false;
};

const PORT = normalizePort(env.PORT || 5000);

app.listen(PORT, () => {
  log(`Server running on Port ${PORT}`);
});

export default app;
