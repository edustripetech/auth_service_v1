import response from '../helpers/response';
import authHelper, { getCookieDomain } from '../helpers/auth';

/**
 * @name signUp
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} User object
 */
const signUp = async (req, res) => {
  const user = req.body;
  try {
    const cookieDomain = getCookieDomain(req);
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
  const user = req.body;
  try {
    const cookieDomain = getCookieDomain(req);
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
    const code = (e && e.code) || 500;
    return response.error(res, 500, e, code, e && e.message);
  }
};

/**
 * @name registerSchool
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} School object
 */
async function registerSchool(req, res) {
  try {
    const school = await authHelper.registerSchool(req.body);
    return response.created(res, school, 'School registration successful');
  } catch (e) {
    const code = (e && e.code) || 500;
    return response.error(res, 500, e, code, e && e.message);
  }
}

export default {
  signIn,
  signUp,
  registerSchool,
};
