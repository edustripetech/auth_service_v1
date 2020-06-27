import uuid from 'uuid';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: { type: DataTypes.UUID, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    userType: {
      type: DataTypes.ENUM(
        'Student_Guardian',
        'School_Admin',
        'School_Staff',
        'School_Student',
      ),
      allowNull: false,
    },
    gender: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    schoolId: { type: DataTypes.UUID },
  },
  {
    sequelize,
    paranoid: true,
  });
  Users.beforeCreate((user) => {
    user.id = uuid();
  });
  Users.getDetail = function getDetail(user, withCredential = false) {
    const where = user && user.id ? { id: user.id } : { email: user.email };
    let include = []; // Add all models to be included here
    if (withCredential) include = include.concat('Credentials');
    return this.findOne({
      where,
      include,
    });
  };
  Users.getDetailById = function getDetailById(id, withCredential = false) {
    return this.getDetail({ id }, withCredential);
  };
  Users.getDetailByEmail = function getDetailByEmail(email, withCredential = false) {
    return this.getDetail({ email }, withCredential);
  };
  Users.associate = function associations(models) {
    // associations can be defined here
    Users.hasOne(models.Credentials, {
      foreignKey: 'userId',
      as: 'credential',
    });
  };
  return Users;
};
