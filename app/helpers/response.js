/**
 * @method success
 * @param {object} res - Express response object
 * @param {Number} status - Http status code for the response
 * @param {object} data - Data to be return as part of response body
 * @param {String} message - Message accompanying the response data
 * @returns {json} Formatted JSON server response
 */
const success = (res, status, data, message = 'Success') => res
  .status(status).json({ code: status, data, message });

/**
 * @method ok
 * @param {object} res - Express response object
 * @param {object} data - Data to be return as part of response body
 * @param {String} message - Message accompanying the response data
 * @returns {json} Formatted JSON server response
 */
const ok = (res, data, message = 'Ok') => success(res, 200, data, message);

/**
 * @method created
 * @param {object} res - Express response object
 * @param {object} data - Data to be return as part of response body
 * @param {String} message - Message accompanying the response data
 * @returns {json} Formatted JSON server response
 */
const created = (res, data, message = 'New resource has been created') => success(
  res, 201, data, message,
);

/**
 * @method error
 * @param {object} res - Express response object
 * @param {Number} status - Http status code for the error
 * @param {object | String} errorDetail - Error detail to be return as part of response body
 * @param {Number | null} code - The specific app error code which default to status
 * @param {String} message - Message accompanying the error object
 * @returns {json} Formatted JSON server response
 */
const error = (res, status, errorDetail = {}, code = null, message = '') => {
  message = message || 'Oops! something went wrong';
  code = code || status;
  return res.status(status).json({ code, error: errorDetail, message });
};

/**
 * @method notFound
 * @param {object} res - Express response object
 * @param {object | String} errorDetail - Error detail to be return as part of response body
 * @param {Number | null} code - The specific app error code which default to status
 * @returns {json} Formatted JSON server response
 */
const notFound = (res, errorDetail = {}, code = null) => error(
  res, 404, errorDetail, code, 'Requested resource not found',
);

/**
 * @method unAuthorize
 * @param {object} res - Express response object
 * @param {object | String} errorDetail - Error detail to be return as part of response body
 * @param {Number | null} code - The specific app error code which default to status
 * @returns {json} Formatted JSON server response
 */
const unAuthorize = (res, errorDetail = {}, code = null) => error(
  res, 401, errorDetail, code, 'Not authorized to access this resource',
);

/**
 * @method badRequest
 * @param {object} res - Express response object
 * @param {object | String} errorDetail - Error detail to be return as part of response body
 * @param {Number | null} code - The specific app error code which default to status
 * @returns {json} Formatted JSON server response
 */
const badRequest = (res, errorDetail = {}, code = null) => error(
  res, 400, errorDetail, code, 'Could not understand request',
);

/**
 * @method internalServer
 * @param {object} res - Express response object
 * @param {object | String} errorDetail - Error detail to be return as part of response body
 * @param {Number | null} code - The specific app error code which default to status
 * @returns {json} Formatted JSON server response
 */
const internalServer = (res, errorDetail = {}, code = null) => error(
  res, 500, errorDetail, code, 'Oops! Something went wrong',
);

export default {
  ok,
  success,
  created,
  error,
  notFound,
  unAuthorize,
  badRequest,
  internalServer,
};
