import { v4 as uuidv4 } from 'uuid';

module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define('School', {
    id: { type: DataTypes.UUID, primaryKey: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, validate: { isEmail: true } },
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {});

  School.beforeCreate((school) => {
    school.id = uuidv4();
  });

  School.findByName = (name) => School.findOne({ where: { name } });

  return School;
};
