import express from 'express';
import response from '../helpers/response';

const routes = express.Router();

routes.get('/', (req, res) => response.ok(res, {}, 'Welcome to Edustripe authentication service!'));

export default routes;
