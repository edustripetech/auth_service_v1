import response from '../helpers/response';
import createWard from '../helpers/ward';

/**
 * @name create
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} Ward object
 */
const create = async (req, res) => {
  try {
    const { id } = req.user;
    const ward = await createWard(req.body, id);
    return response.created(res, ward);
  } catch (e) {
    return response.internalServer(res, e);
  }
};

export { create };
