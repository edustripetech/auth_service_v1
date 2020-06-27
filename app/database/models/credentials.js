import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

module.exports = (sequelize, DataTypes) => {
  const Credentials = sequelize.define('Credentials', {
    id: { type: DataTypes.UUID, primaryKey: true },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        minLength(value) {
          if ((value || '').length < 8) {
            throw new Error('Password length must be greater than or equal to 8 characters.');
          }
        },
      },
    },
    userId: { type: DataTypes.UUID, allowNull: false },
    primaryPhone: { type: DataTypes.STRING },
  },
  {
    sequelize,
    paranoid: true,
  });
  Credentials.beforeCreate(async function beforeCreate(credential) {
    credential.id = uuidv4();
    credential.password = await this.hashPassword(credential.password);
  });
  Credentials.hashPassword = async (secret) => {
    const passwordSalt = await bcrypt.genSalt(10);
    return bcrypt.hash(secret, passwordSalt);
  };
  Credentials.validatePassword = function isPasswordValid(
    providedPassword,
    originalPassword,
  ) {
    return bcrypt.compare(providedPassword, originalPassword);
  };

  Credentials.associate = function associations(models) {
    // associations can be defined here
    Credentials.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return Credentials;
};
