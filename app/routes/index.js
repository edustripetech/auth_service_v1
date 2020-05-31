import express from 'express';
import response from '../helpers/response';
import controllers from '../controllers';
import cache, { redisClient } from '../helpers/cache';

const routes = express.Router();

routes.get('/', (req, res) => response.ok(res, {}, 'Welcome to Edustripe authentication service!'));
Routes.get('/', cache, (request, response) => {
  const data = '<h1>Welcome to Edustripe authentication service!</h1>';
  redisClient.setex(`${request.method} ${request.url}`, 3600, data);
  return response.status(200).send(data);
});


routes.post('/auth/sign-up', controllers.signUp);

routes.post('/auth/sign-in', controllers.signIn);

export default routes;
