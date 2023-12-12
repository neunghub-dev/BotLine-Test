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
    include: [
      {
        model: db.Users,
        attributes: ["name", "tel"],
      },
      {
        model: db.admins,
        attributes: ["name"],
      },
    ],
    where: {
      [Op.or]: [{ event: "withdraw" }, { event: "add" }],
    },
  });
  return tc;
};

module.exports = {
  createTransaction,
  getAllTransaction,
};
