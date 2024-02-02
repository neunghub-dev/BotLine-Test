"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admins.init(
    {
      name: DataTypes.STRING,
      tel: DataTypes.STRING,
      role: DataTypes.ENUM("admin", "superAdmin", "system"),
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      partner_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "admins",
    }
  );
  return admins;
};
