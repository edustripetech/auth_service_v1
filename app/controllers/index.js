import response from '../helpers/response';
import authHelper, { getBaseDomainFromUrl } from '../helpers/auth';
import env from '../config/env';

/**
 * @name signUp
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} User object
 */
const signUp = async (req, res) => {
  const user = req.body;
  let cookieDomain = req.get('referer') || env.APP_URL;
  cookieDomain = getBaseDomainFromUrl(cookieDomain);
  try {
    const reply = await authHelper.signUp(user);
    if (reply) {
      authHelper.handlePostAuth(
        res,
        reply.user,
        cookieDomain,
      );
      return response.created(res, reply.user);
    }
    return response.error(res, 500);
  } catch (e) {
    const code = (e && e.code) || 500;
    return response.error(res, 500, e, code, e && e.message);
  }
};

/**
 * @name signIn
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} User object
 */
const signIn = async (req, res) => {
  const cookieDomain = req.get('referer');
  const user = req.body;
  try {
    const reply = await authHelper.signIn(user);
    if (reply) {
      authHelper.handlePostAuth(
        res,
        reply.user,
        cookieDomain,
      );
      return response.ok(res, reply.user);
    }
    return response.error(res, 500);
  } catch (e) {
    if (e.code === 401) {
      return response.unAuthorize(res, e);
    }
    return response.error(res, 500, e);
  }
};

export default {
  signIn,
  signUp,
};
