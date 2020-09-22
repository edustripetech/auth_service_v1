import express from 'express';
import * as wardController from '../controllers/ward';

const routes = express.Router();

routes.post('/create', wardController.create);

export default routes;
