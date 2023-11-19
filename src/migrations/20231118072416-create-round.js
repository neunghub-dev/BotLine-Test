"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rounds", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      round: {
        type: Sequelize.INTEGER,
      },
      isOpen: {
        type: Sequelize.BOOLEAN,
      },
      isClose: {
        type: Sequelize.BOOLEAN,
      },
      type: {
        type: Sequelize.ENUM("success", "inProgress", "cancel"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("rounds");
  },
};
