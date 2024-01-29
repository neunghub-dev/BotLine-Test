"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users_admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // users_admins.belongsTo(models.partner, { foreignKey: "partner_id" });
      // define association here
    }
  }
  users_admins.init(
    {
      uuid: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users_admins",
    }
  );
  return users_admins;
};
