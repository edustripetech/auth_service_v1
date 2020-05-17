import redis from 'redis';

const REDIS_PORT = process.env.REDIS_PORT || 6379;

export const redisClient = redis.createClient(REDIS_PORT);

/**
 * @function cache
 * @description A middleware function for caching requests
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} next - The next function
 * @returns {object} Returns a JSON API response
 */
function cache(req, res, next) {
  const { method, url } = req;
  redisClient.get(`${method} ${url}`, (error, cachedData) => {
    if (error) return res.status(500).json({ error });
    if (cachedData) {
      res.status(200).send(cachedData);
    } else {
      next();
    }
  });
}

export default cache;
