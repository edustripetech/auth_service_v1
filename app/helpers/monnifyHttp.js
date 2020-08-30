import axios from 'axios';
import monnifyConfig from '../config/monnify';

const { baseURL, base64AuthToken } = monnifyConfig;

/**
 * @method getAccessToken
 * @returns {string} An access token from monnify
 */
async function getAccessToken() {
  // Create a config object for authenticating with monnify's API
  const authConfig = {
    url: '/auth/login',
    method: 'post',
    baseURL,
    headers: { Authorization: `Basic ${base64AuthToken}` },
  };

  const {
    data: {
      responseBody: { accessToken },
    },
  } = await axios(authConfig);

  return accessToken;
}

/**
 * @method getAxiosInstance
 * @returns {object} An instance of the Axios obejct
 */
async function getAxiosInstance() {
  // Create a new axios instance
  const instance = axios.create({
    baseURL,
  });

  const token = await getAccessToken();

  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  return instance;
}

export default getAxiosInstance;
