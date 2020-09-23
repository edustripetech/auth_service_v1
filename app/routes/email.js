import express from 'express';
import emailController from '../controllers/email';

const routes = express.Router();

routes.get('/test/:name/:email', emailController.sendTestMail);

export default routes;
