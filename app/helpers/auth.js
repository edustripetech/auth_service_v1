import { URL } from 'url';
import jwtHelper from './jwt';
import http from './http';
import env from '../config/env';
import apiEndpoint from '../config/apiEndpoint';

const { APP_URL, APP_PROTOCOL } = env;

/**
 * @name getBaseDomainFromUrl
 * @param {string} url
 * @return {string} The base domain
 */
export const getBaseDomainFromUrl = (url) => {
  const { hostname } = new URL(url);
  if ((hostname.match(/\./g) || []).length > 1) {
    const hostArr = hostname.split('.');
    return `${hostArr[hostArr.length - 2]}.${hostArr[hostArr.length - 1]}`;
  }
  return hostname;
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
  cookieDomain = cookieDomain || APP_URL;
  cookieDomain = (cookieDomain || '').startsWith('http')
    ? cookieDomain
    : `${APP_PROTOCOL}://${cookieDomain}`;
  const domain = getBaseDomainFromUrl(cookieDomain); // including all subDomain
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
    res.set('X-XSRF-TOKEN', `Bearer ${tokens.refresh}`);
  }
};

/**
 * @name signUp
 * @param {Object} rawUser the platform the request is coming from
 * @return {*} User details
 */
const signUp = async (rawUser = {}) => {
  const errorObject = {
    code: 502,
    subCode: 0,
    message: 'Bad gateway',
  };
  const resp = await http.post(apiEndpoint.SAVE_USER, rawUser);
  if (!(resp && resp.data)) {
    throw errorObject;
  }
  return resp.data.data;
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
