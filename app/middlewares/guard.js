import response from '../helpers/response';

/**
 * @name requiresUserId
 * @param {Object} req Express request Object
 * @param {Object} res Express response Object
 * @param {Function} next Express next function
 * @returns {json} Response
 */
const requiresUserId = (req, res, next) => {
  if (!(req.user || {}).id) {
    return response.unAuthorize(res, req.authError || {}, 1);
  }
  return next();
};

export default {
  requiresUserId,
};
