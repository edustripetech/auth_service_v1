import axios from 'axios';
import env from '../config/env';

const { APP_PROTOCOL, APP_URL } = env;

/**
 * @name httpRequestInterceptor
 * @param {*} config
 * @return {*} Updated axios config
 */
const httpRequestInterceptor = (config) => {
  if (config.method.toUpperCase() === 'POST') {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
  }
  config.headers.Accept = 'application/json';
  config.headers.Cache = 'no-cache';
  config.headers.origin = `${APP_PROTOCOL}://${APP_URL}`;
  return config;
};

const http = axios.create({ withCredentials: true });

http.interceptors.request.use(httpRequestInterceptor, (error) => Promise.reject(error));

export default http;
