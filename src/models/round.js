"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rounds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  rounds.init(
    {
      round: DataTypes.STRING,
      isOpen: DataTypes.BOOLEAN,
      isClose: DataTypes.BOOLEAN,
      openRoundAt: DataTypes.DATE,
      type: DataTypes.ENUM("success", "inProgress", "cancel"),
    },
    {
      sequelize,
      modelName: "rounds",
    }
  );
  return rounds;
};
