"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      name: DataTypes.STRING,
      tel: DataTypes.STRING,
      uuid_line: DataTypes.STRING,
      line_id: DataTypes.STRING,
      credit: DataTypes.DECIMAL(10, 1),
      bonus: DataTypes.DOUBLE,
      partner_id: DataTypes.INTEGER,
      ref: DataTypes.STRING,
      invite_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
