import { v4 as uuidv4 } from 'uuid';

module.exports = (sequelize, DataTypes) => {
  const Profiles = sequelize.define('Profiles', {
    id: { type: DataTypes.UUID, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    parentId: { type: DataTypes.UUID },
    bio: DataTypes.TEXT,
    avatar: DataTypes.STRING,
  }, {
    sequelize,
    paranoid: true,
  });
  Profiles.beforeCreate((profile) => {
    profile.id = uuidv4();
  });

  Profiles.getDetailByUserId = function getDetail(userId) {
    return this.findOne({
      where: { userId },
      include: ['user'],
    });
  };

  Profiles.associate = (models) => {
    // associations can be defined here
    Profiles.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'user',
    });
    Profiles.belongsTo(models.Users, {
      foreignKey: 'parentId',
      as: 'parent',
    });
  };
  return Profiles;
};
