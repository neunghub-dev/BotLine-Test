"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class round_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      round_detail.belongsTo(models.round, { foreignKey: "roundId" });
      round_detail.belongsTo(models.user, { foreignKey: "userId" });
      // define association here
    }
  }
  round_detail.init(
    {
      roundId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      ka: DataTypes.STRING,
      unit: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "round_detail",
    }
  );
  return round_detail;
};
