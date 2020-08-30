import base64 from 'base-64';
import env from './env';

const {
  MON_API_KEY, MON_SECRET, MON_CONTRACT_CODE, MON_BASE_URL,
} = env;

export default {
  base64AuthToken: base64.encode(`${MON_API_KEY}:${MON_SECRET}`),
  contractCode: MON_CONTRACT_CODE,
  baseURL: MON_BASE_URL,
};
