import { URL } from 'url';
import models from '../database/models';
import jwtHelper from './jwt';
import env from '../config/env';

const { APP_URL, APP_PROTOCOL } = env;
const { Users, Credentials, sequelize } = models;

/**
 * @name getBaseDomainFromUrl
 * @param {string} url
 * @return {string} The base domain
 */
export const getBaseDomainFromUrl = (url) => {
  if (!url) return url;
  const { hostname } = new URL(url);
  if ((hostname.match(/\./g) || []).length > 1) {
    const hostArr = hostname.split('.');
    return `${hostArr[hostArr.length - 2]}.${hostArr[hostArr.length - 1]}`;
  }
  return hostname;
};

/**
 * @name getCookieDomain
 * @param {Object} req Express request object
 * @return {string} The base domain
 */
export const getCookieDomain = (req) => {
  let domain = req.get('origin') || req.get('referer') || APP_URL;
  domain = domain.startsWith('http')
    ? domain
    : `${APP_PROTOCOL}://${domain}`;
  domain = getBaseDomainFromUrl(domain);
  return domain;
};

/**
 * @name getTokensFromRequest
 * @param {Object} req Express request object
 * @return {{accessToken: *, refreshToken: *}} Token Object
 */
export const getTokensFromRequest = (req) => {
  let { accessToken, refreshToken } = req.cookies;
  if (!accessToken) {
    accessToken = req.get('Authorization');
    [, accessToken] = (accessToken || '').split(' ');
  }
  if (!accessToken) accessToken = req.query.accessToken;
  if (!refreshToken) {
    refreshToken = req.get('X-REFRESH-TOKEN');
    [, refreshToken] = (refreshToken || '').split(' ');
  }
  if (!refreshToken) refreshToken = req.query.refreshToken;
  return { accessToken, refreshToken };
};

/**
 * @name setTokensToResponse
 * @param {Object} res Express response object
 * @param {Object} tokens
 * @param {string} cookieDomain
 * @return {string} Referer Url
 */
export const setTokensToResponse = (res, tokens, cookieDomain = '') => {
  const cookieLife = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Expires in two weeks
  if (tokens.access) {
    res.cookie('accessToken', tokens.access, {
      domain: cookieDomain,
      expires: cookieLife,
    });
    res.set('Authorization', `Bearer ${tokens.access}`);
  }
  if (tokens.refresh) {
    res.cookie('refreshToken', tokens.refresh, {
      domain: cookieDomain,
      expires: cookieLife,
    });
    res.set('X-REFRESH-TOKEN', `Bearer ${tokens.refresh}`);
  }
};

/**
 * @name handlePostAuth
 * @param {Object} res Express response object
 * @param {Object} user
 * @param {string} cookieDomain
 * @return {null} Null
 */
const handlePostAuth = (res, user, cookieDomain) => {
  const tokens = jwtHelper.generateTokens({
    id: user.id,
    email: user.email,
  });
  setTokensToResponse(res, tokens, cookieDomain);
};

/**
 * @name signUp
 * @param {Object} rawUser the platform the request is coming from
 * @return {*} User details
 */
const signUp = async (rawUser = {}) => {
  const errorObject = {
    code: 401,
    subCode: 0,
    message: 'Unauthorized!',
  };
  const t = await sequelize.transaction();
  const reply = {};
  const user = { ...rawUser };
  const { email, password, phoneNumber } = user || {};
  delete user.phoneNumber;
  delete user.password;
  const existingByEmail = await Users.getDetailByEmail(email);
  if (existingByEmail) {
    errorObject.message = 'Email already exits';
    errorObject.code = 409;
    throw errorObject;
  }
  try {
    let newUser = await Users.create(user, { transaction: t });
    await Credentials.create({ password, userId: newUser.id, phoneNumber }, { transaction: t });
    await t.commit();
    newUser = await Users.getDetailById(newUser.id, true);
    reply.user = newUser.get({ plain: true });
    delete reply.user.credential.password;
    return reply;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

/**
 * @name signIn
 * @param {{email:string, password:string}} user the platform the request is coming from
 * @return {*} User details
 */
const signIn = async (user) => {
  const errorObject = {
    code: 401,
    subCode: 0,
    message: 'Unauthorized!',
  };
  if (!user || !user.email) {
    errorObject.message = 'Email is required';
    throw errorObject;
  }
  if (!user || !user.password) {
    errorObject.message = 'Password is required';
    throw errorObject;
  }
  const reply = {};
  let isCredentialValid = false;
  const existingUser = await Users.getDetailByEmail(
    user.email || '',
    true,
  );
  if (existingUser && existingUser.credential) {
    isCredentialValid = await Credentials.validatePassword(
      user.password,
      existingUser.credential.get({ plain: true }).password,
    );
  }
  if (!isCredentialValid) {
    errorObject.message = 'Email or password incorrect!';
    throw errorObject;
  }
  reply.user = existingUser.get({ plain: true });
  delete reply.user.credential.password;
  return reply;
};

export default {
  signIn,
  signUp,
  handlePostAuth,
};
