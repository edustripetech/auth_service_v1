module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('AccountVerifications', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    accountId: {
      allowNull: false,
      type: Sequelize.UUID,
    },
    verifiedAt: {
      type: Sequelize.DATE,
    },
    lastSentAt: {
      type: Sequelize.DATE,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('AccountVerifications'),
};
