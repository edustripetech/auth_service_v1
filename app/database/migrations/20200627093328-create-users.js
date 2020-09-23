module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    email: {
      type: Sequelize.STRING,
    },
    userType: {
      type: Sequelize.ENUM(
        'Student_Guardian',
        'School_Admin',
        'School_Staff',
        'School_Student',
      ),
      allowNull: false,
    },
    gender: { type: Sequelize.STRING },
    address: { type: Sequelize.TEXT },
    schoolId: { type: Sequelize.UUID },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('Users'),
};
