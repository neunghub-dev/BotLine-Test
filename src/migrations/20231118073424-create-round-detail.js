"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("round_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      roundId: {
        type: Sequelize.INTEGER,
        references: {
          model: "rounds",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      ka: {
        type: Sequelize.STRING,
      },
      unit: {
        type: Sequelize.INTEGER,
      },
      isDeduction: {
        type: Sequelize.BOOLEAN,
      },
      isCancel: {
        type: Sequelize.BOOLEAN,
      },
      k0: {
        type: Sequelize.STRING,
      },
      k1: {
        type: Sequelize.STRING,
      },
      k2: {
        type: Sequelize.STRING,
      },
      k3: {
        type: Sequelize.STRING,
      },
      k4: {
        type: Sequelize.STRING,
      },
      k5: {
        type: Sequelize.STRING,
      },
      k6: {
        type: Sequelize.STRING,
      },
      sumTotal: {
        type: Sequelize.INTEGER,
      },
      difference: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("round_details");
  },
};
