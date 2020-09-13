import models from '../database/models';
import response from '../helpers/response';

const { Users } = models;

/**
 * @name getUsers
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} Paginated Users
 */
const getUsers = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const users = await Users.paginate(page, limit);
    return response.ok(res, users);
  } catch (e) {
    return response.internalServer(res, e);
  }
};

/**
 * @name getUser
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} User object
 */
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.getDetailById(id);
    if (user) {
      return response.ok(res, user);
    }
    return response.notFound(res);
  } catch (e) {
    return response.internalServer(res, e);
  }
};

/**
 * @name myProfile
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} User object
 */
const myProfile = async (req, res) => {
  try {
    const { id } = req.user || {};
    const user = await Users.getDetailById(id, true);
    if (user) {
      delete user.credential.password;
      return response.ok(res, user);
    }
    return response.notFound(res);
  } catch (e) {
    return response.internalServer(res, e);
  }
};

export default {
  getUsers,
  getUser,
  myProfile,
};
