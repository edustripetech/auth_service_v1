import models from '../database/models';
import response from '../helpers/response';

const { Profiles } = models;

/**
 * @name edit
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} User object
 */
const edit = async (req, res) => {
  try {
    const { id } = req.user;
    const { bio, avatar } = req.body;
    const [, profile] = await Profiles.update({ bio, avatar }, {
      where: { userId: id }, returning: true, plain: true,
    });
    return response.ok(res, profile);
  } catch (e) {
    return response.internalServer(res, e);
  }
};

export { edit };
