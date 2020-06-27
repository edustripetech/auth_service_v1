import jwt from 'jsonwebtoken';
import jwtConf from '../config/jwt';

/**
 * @name JWT
 * @type {{renewAccessToken: renewAccessToken, generateTokens:(function(Object): {access: string, refresh: string})}}
 */
const JWT = (() => {
  /**
   * @name makeToken
   * @param {Object} user
   * @param {string} lifeSpan
   * @returns {undefined|string} The generated token string
   */
  const makeToken = (user, lifeSpan = jwtConf.ACCESS_TOKEN_LIFESPAN) => jwt
    .sign(user, jwtConf.SECRET_KEY, { expiresIn: lifeSpan });

  /**
   * @name verifyToken
   * @param {String} token the access token string
   * @param {Boolean} includeSignature
   * @return {Object} the user object
   */
  const verifyToken = (token, includeSignature = true) => {
    let user;
    return jwt.verify(token, jwtConf.SECRET_KEY, (err, decoded) => {
      if (err) {
        const errorObject = {
          code: 401,
          subCode: 0,
          message: 'Unauthorized!',
          stack: err.stack,
        };
        switch (err.name) {
          case 'TokenExpiredError':
            errorObject.message = 'Supplied token has expired!';
            errorObject.subCode = 1;
            break;
          case 'JsonWebTokenError':
            errorObject.message = 'Supplied token is invalid!';
            break;
          default:
            break;
        }
        throw errorObject;
      }
      user = decoded;
      if (!!user && !includeSignature) {
        delete user.iat; // Delete the issuedAt field
        delete user.exp; // Delete the expireAt field
      }
      return user;
    });
  };

  /**
   * @name generateTokens
   * @param {Object} user
   * @returns {{access: string, refresh: string}}
   * The generated token object containing access token and refresh token
   */
  const generateTokens = (user) => {
    const access = makeToken(user);
    const refresh = makeToken(user, jwtConf.REFRESH_TOKEN_LIFESPAN);
    return { access, refresh };
  };

  /**
   * @name renewAccessToken
   * @param {string} oldToken
   * @param {string} refreshToken
   * @returns {({id}|{}|string)[]} The new access token
   */
  const renewAccessToken = async (oldToken, refreshToken) => {
    const errorObject = {
      code: 401,
      subCode: 0,
      message: 'Unauthorized!',
    };
    if (!oldToken || !refreshToken) {
      errorObject.subCode = 2;
      errorObject.message = 'Invalid arguments: provide user and refresh token';
      throw errorObject;
    }
    const user = await JWT.verifyToken(refreshToken, false);
    if (user && user.id) {
      const token = makeToken(user);
      return [token, user];
    }
    errorObject.subCode = 3;
    errorObject.message = 'Invalid refresh token: supplied token is invalid';
    throw errorObject;
  };

  return {
    generateTokens,
    renewAccessToken,
    verifyToken,
  };
})();

export default JWT;
