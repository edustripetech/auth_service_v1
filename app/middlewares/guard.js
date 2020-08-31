import response from '../helpers/response';

/**
 * @name requireAuthentication
 * @param {Object} req Express request Object
 * @param {Object} res Express response Object
 * @param {Function} next Express next function
 * @returns {json} Response
 */
const requireAuthentication = (req, res, next) => {
  if (!(req.user || {}).id) {
    return response.unAuthorize(res, req.authError || {}, 1);
  }
  return next();
};

export default {
  requireAuthentication,
};
