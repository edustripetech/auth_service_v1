import response from '../helpers/response';
import authHelper, { getCookieDomain } from '../helpers/auth';
import EmailService from '../services/EmailServices';
import JWT from '../helpers/jwt';
import JWTConf from '../config/jwt';
import models from '../database/models';

const { Users, AccountVerification } = models;

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
      const { access, refresh } = authHelper.handlePostAuth(
        res,
        reply.user,
        cookieDomain,
      );
      const verificationToken = await JWT.makeToken(
        { email: user.email },
        JWTConf.ACTIVATION_TOKEN_LIFESPAN,
      );
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/verify-email?token=${verificationToken}`;
      new EmailService().sendWelcomeEmail(user, verificationUrl, () => {
        AccountVerification.create({ accountId: reply.user.id, lastSentAt: new Date() });
      });
      return response
        .created(res, { user: reply.user, accessToken: access, refreshToken: refresh });
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
      const { access, refresh } = authHelper.handlePostAuth(
        res,
        reply.user,
        cookieDomain,
      );
      return response.ok(res, { user: reply.user, accessToken: access, refreshToken: refresh });
    }
    return response.error(res, 500);
  } catch (e) {
    const code = (e && e.code) || 500;
    return response.error(res, 500, e, code, e && e.message);
  }
};

/**
 * @name verifyEmail
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} User object
 */
const verifyEmail = async (req, res) => {
  const { token } = req.query;
  let user;
  try {
    if (token) {
      user = await JWT.verifyToken(token, false);
    }
    user = await Users.getDetailByEmail(user.email);
    if (!user) {
      return response.notFound(res);
    }
    if (user.verification && user.verification.verifiedAt) {
      return response.ok(res, {}, 'User has already been verified!');
    }
    if (user.verification && !user.verification.verifiedAt) {
      user.verification.verifiedAt = new Date();
      user.verification.save();
      const cookieDomain = getCookieDomain(req);
      const { access, refresh } = authHelper.handlePostAuth(
        res,
        user,
        cookieDomain,
      );
      return response.ok(res, { user, accessToken: access, refreshToken: refresh });
    }
    return response.notFound(res, { message: 'Verification record not found!' });
  } catch (e) {
    const code = (e && e.code) || 500;
    return response.error(res, 500, e, code, e && e.message);
  }
};

export default {
  signIn,
  signUp,
  verifyEmail,
};
