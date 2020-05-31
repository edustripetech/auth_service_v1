import env from './env';

const { APP_KEY } = env;

const JWTConf = {
  SECRET_KEY: APP_KEY,
  ACCESS_TOKEN_LIFESPAN: '1h',
  REFRESH_TOKEN_LIFESPAN: '2d',
};

export default JWTConf;
