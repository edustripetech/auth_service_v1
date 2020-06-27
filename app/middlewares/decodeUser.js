import jwtHelper from '../helpers/jwt';
import { getTokensFromRequest } from '../helpers/auth';

/**
 * @name decodeUser
 * @param {Object} req Express request Object
 * @param {Object} res Express response Object
 * @param {Function} next Express next function
 * @returns {Promise<void>} Null
 */
const decodeUser = async (req, res, next) => {
  const { accessToken } = getTokensFromRequest(req);
  try {
    if (!accessToken) {
      req.authError = {
        code: 401,
        subCode: 0,
        message: 'Unauthorized: Access token not found!',
      };
    }
    if (accessToken) req.user = await jwtHelper.verifyToken(accessToken, false);
  } catch (e) {
    req.authError = e;
  }
  next();
};

export default decodeUser;
