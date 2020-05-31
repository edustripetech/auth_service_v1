import express from 'express';
import response from '../helpers/response';
import controllers from '../controllers';

const routes = express.Router();

routes.get('/', (req, res) => response.ok(res, {}, 'Welcome to Edustripe authentication service!'));

routes.post('/auth/sign-up', controllers.signUp);

routes.post('/auth/sign-in', controllers.signIn);

export default routes;
