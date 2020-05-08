import express from 'express';

const routes = express.Router();

routes.get('/', (request, response) => response.status(200)
  .json({
    code: 200,
    message: 'Welcome to Edustripe authentication service!',
    data: {},
  }));

export default routes;
