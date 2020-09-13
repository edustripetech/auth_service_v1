import express from 'express';
import userController from '../controllers/user';

const routes = express.Router();

routes.get('/', userController.getUsers);

routes.get('/profile', userController.myProfile);

routes.get('/:id', userController.getUser);

export default routes;
