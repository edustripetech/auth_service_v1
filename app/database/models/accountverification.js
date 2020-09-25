import { v4 as uuidv4 } from 'uuid';

module.exports = (sequelize, DataTypes) => {
  const AccountVerification = sequelize.define('AccountVerification', {
    accountId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    verifiedAt: { type: DataTypes.DATE },
    lastSentAt: { type: DataTypes.DATE },
  }, {});
  AccountVerification.beforeCreate(async (verification) => {
    verification.id = uuidv4();
  });
  AccountVerification.associate = function (models) {
    // associations can be defined here
    AccountVerification.belongsTo(models.Users, {
      foreignKey: 'accountId',
      as: 'user',
    });
  };
  return AccountVerification;
};
