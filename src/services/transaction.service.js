const db = require("../models");
const transaction = db.transaction;
const Op = db.Sequelize.Op;

const createTransaction = async (data) => {
  const createTransaction = await transaction.create(data);
  return createTransaction;
};

module.exports = {
  createTransaction,
};
