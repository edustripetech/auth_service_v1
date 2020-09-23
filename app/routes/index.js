import express from 'express';
import response from '../helpers/response';
import controllers from '../controllers';
import userRoute from './user';
import profileRoute from './profile';
import wardRoute from './ward';
import emailRoute from './email';
import cache, { redisClient } from '../helpers/cache';
import guard from '../middlewares/guard';

const routes = express.Router();

routes.get('/', (req, res) =>
  response.ok(res, {}, 'Welcome to Edustripe authentication service!')
);

routes.get('/', cache, (req, res) => {
  const data = '<h1>Welcome to Edustripe authentication service!</h1>';
  redisClient.setex(`${req.method} ${req.url}`, 3600, data);
  return res.status(200).send(data);
});

routes.post('/auth/sign-up', controllers.signUp);

routes.post('/auth/sign-in', controllers.signIn);

routes.use('/users', guard.requireAuthentication, userRoute);

routes.use('/profiles', guard.requireAuthentication, profileRoute);

routes.use('/wards', guard.requireAuthentication, wardRoute);

routes.use('/email', emailRoute);

export default routes;
