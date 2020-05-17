import express from 'express';
import cache, { redisClient } from '../helpers/cache';

const Routes = express.Router();

Routes.get('/', cache, (request, response) => {
  const data = '<h1>Welcome to Edustripe authentication service!</h1>';
  redisClient.setex(`${request.method} ${request.url}`, 3600, data);
  return response.status(200).send(data);
});

export default Routes;
