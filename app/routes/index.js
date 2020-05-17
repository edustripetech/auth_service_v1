import express from "express";

const Routes = express.Router();

Routes.get("/", (request, response) =>
  response.status(200).json({
    message: "Welcome to Edustripe authentication service!",
  })
);

export default Routes;
