import { URL } from 'url';
import models from '../database/models';
import jwtHelper from './jwt';
import http from './http';
import env from '../config/env';
import apiEndpoint from '../config/apiEndpoint';

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
  cookieDomain = cookieDomain || APP_URL;
  cookieDomain = getBaseDomainFromUrl(cookieDomain); // including all subDomain
  const domain = (cookieDomain || '').startsWith('http')
    ? cookieDomain
    : `${APP_PROTOCOL}://${cookieDomain}`;
  const cookieLife = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Expires in two weeks
  if (tokens.access) {
    res.cookie('accessToken', tokens.access, {
      domain,
      expires: cookieLife,
    });
    res.set('Authorization', `Bearer ${tokens.access}`);
  }
  if (tokens.refresh) {
    res.cookie('refreshToken', tokens.refresh, {
      domain,
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

  let newUser = await Users.create(user, { transaction: t });
  await Credentials.create({ password, userId: newUser.id, phoneNumber }, { transaction: t });
  newUser = await Users.getDetailById(newUser.id);

  reply.user = newUser.get({ plain: true });
  return reply;
};

/**
 * @name signIn
 * @param {{email:string, password:string}} user the platform the request is coming from
 * @return {*} User details
 */
const signIn = async (user) => {
  const errorObject = {
    code: 502,
    subCode: 0,
    message: 'Bad gateway',
  };
  const resp = await http.post(apiEndpoint.CONFIRM_USER_CLAIM, user);
  if (!(resp && resp.data)) {
    throw errorObject;
  }
  return resp.data.data;
};

export default {
  signIn,
  signUp,
  handlePostAuth,
};
