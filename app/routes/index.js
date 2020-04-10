import express from 'express';

const Routes = express.Router();

Routes.get('/', (request, response) => response.status(200)
  .send('<h1>Welcome to Edustripe authentication service!</h1>'));

export default Routes;
