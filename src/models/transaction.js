"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transaction.belongsTo(models.Users, { foreignKey: "userId" });
      transaction.belongsTo(models.admins, { foreignKey: "adminId" });
      // define association here
    }
  }
  transaction.init(
    {
      event: DataTypes.STRING,
      unit: DataTypes.DOUBLE,
      userId: DataTypes.INTEGER,
      adminId: DataTypes.INTEGER,
      isCancel: DataTypes.BOOLEAN,
      isComission: DataTypes.BOOLEAN,
      roundId: DataTypes.INTEGER,
      partner_id: DataTypes.INTEGER,
      date : DataTypes.DATE
    },
    {
      sequelize,
      modelName: "transaction",
    }
  );
  return transaction;
};
