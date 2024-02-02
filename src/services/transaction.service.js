const db = require("../models");
const transaction = db.transaction;
const Op = db.Sequelize.Op;

const createTransaction = async (data) => {
  const createTransaction = await transaction.create(data);
  return createTransaction;
};

//type add and withdraw
const getAllTransaction = async (id) => {
  const tc = await transaction.findAll({
    where: {
      [Op.or]: [{ event: "withdraw" }, { event: "add" }],
    },
  });
  return tc;
};

//get Win Lose And sum
const getWinLose = async (id) => {
  const tc = await transaction.findAll({
    where: {
      [Op.or]: [{ event: "win" }, { event: "lose" }],
    },
  });
  return tc;
};

module.exports = {
  getWinLose,
  createTransaction,
  getAllTransaction,
};
