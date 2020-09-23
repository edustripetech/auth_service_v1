import models from '../database/models';

const {
  Users, sequelize, Profiles,
} = models;

/**
 * @name createWard
 * @param {Object} rawWard the platform the request is coming from
 * @param {Object} parentId id of the parent of the ward
 * @return {Object|Error} User details
 */
const createWard = async (rawWard, parentId) => {
  const errorObject = {
    subCode: 0,
  };

  const transaction = await sequelize.transaction();
  const {
    avatar, ...otherWardData
  } = { ...rawWard };
  const user = { ...otherWardData, userType: 'School_Student' };
  const profileData = { parentId };

  const existingWard = await Users.getWardByDetails({ ...otherWardData });

  if (existingWard) {
    const profile = await Profiles.getDetailByUserId(existingWard.id);
    if (profile && profile.parentId === parentId) {
      errorObject.message = 'Ward already exist';
      errorObject.code = 409;
      throw errorObject;
    }
  }
  try {
    let newUser = await Users.create(user, { transaction });
    if (avatar) {
      profileData.avatar = avatar;
    }
    await Profiles.create({ userId: newUser.id, ...profileData }, { transaction }); // Create profile for all new users
    await transaction.commit();
    newUser = await Users.getDetailById(newUser.id, true);
    const newWard = newUser.get({ plain: true });
    return newWard;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};

export default createWard;
