import swagger from "./swagger.json";
import baseResponse from "./baseResponse.json";

swagger.paths["/"] = baseResponse;

module.exports = swagger;
