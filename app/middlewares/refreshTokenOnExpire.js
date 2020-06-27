import jwtHelper from '../helpers/jwt';
import {getCookieDomain, getTokensFromRequest, setTokensToResponse} from '../helpers/auth';

/**
 * @name refreshTokenOnExpire
 * @param {Object} req Express request Object
 * @param {Object} res Express response Object
 * @param {Function} next Express next function
 * @returns {Promise<void>} Null
 */
const refreshTokenOnExpire = async (req, res, next) => {
  const { accessToken, refreshToken } = getTokensFromRequest(req);
  if (req.authError && req.authError.subCode === 1 && refreshToken) {
    try {
      const [newToken, user] = await jwtHelper.renewAccessToken(
        accessToken,
        refreshToken,
      );
      setTokensToResponse(res, { access: newToken }, getCookieDomain(req));
      req.newAccessToken = newToken;
      req.user = user;
    } catch (e) {
      req.authError = e;
    }
  }
  next();
};

export default refreshTokenOnExpire;
