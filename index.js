import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import winstonStream from './app/helpers/logger';
import Routes from './app/routes';

config();

const { log } = console;

const app = express();

app.use(helmet());
app.use(morgan('combined', { stream: winstonStream }));
app.use(json());
app.use(
  cors({
    credentials: true, // In other to receive cookie and other credential from cross origin
  }),
);

app.use(cookieParser());
app.use(urlencoded({ extended: false }));
app.use(Routes);

app.use((error, request, response, next) => {
  response.status(error.status || 500).json({
    message: error.message || 'Oops! something went wrong',
    code: error.code || 500,
    data: error,
  });
  next();
});

app.use('*', (request, response) => {
  response.status(404).send({
    message: 'Requested resource not found!',
    code: 404,
  });
});

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

const PORT = normalizePort(process.env.PORT || 5000);

app.listen(PORT, () => {
  log(`Server running on Port ${PORT}`);
});

export default app;
