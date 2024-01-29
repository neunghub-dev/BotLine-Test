"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class partner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  partner.init(
    {
      name: DataTypes.STRING,
      refCode: DataTypes.STRING,
      client_id: DataTypes.STRING,
      channel_secret: DataTypes.STRING,
      uid: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "partner",
    }
  );
  return partner;
};
