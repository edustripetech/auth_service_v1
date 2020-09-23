import express from 'express';
import * as profileController from '../controllers/profile';

const routes = express.Router();

routes.post('/edit', profileController.edit); // edit profile

export default routes;
