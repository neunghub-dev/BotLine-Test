const db = require("../models");
const transaction = db.transaction;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

const createTransaction = async (data) => {
  const createTransaction = await transaction.create(data);
  return createTransaction;
};

//get all transaction and sum event withdraw and add
const getAllTransactionNoCancel = async (id) => {
  let tc = [];
  if (id === undefined || id === 0) {
    tc = await transaction.findAll({
      where: {
        [Op.or]: [
          { event: "withdraw" },
          { event: "add" },
          { event: "bonus" },
          { event: "comission" },
        ],
      },
    });
  } else {
    tc = await transaction.findAll({
      where: {
        partner_id: id,
        [Op.or]: [
          { event: "withdraw" },
          { event: "add" },
          { event: "bonus" },
          { event: "comission" },
        ],
      },
    });
  }

  return tc;
};

const getWinLoseCom = async (id) => {
  const tc = await transaction.findAll({
    where: {
      isCancel: false,
      isComission: true,
      [Op.or]: [{ event: "win" }, { event: "lose" }],
    },
  });
  return tc;
};

//type add and withdraw
const getAllTransaction = async (id) => {
  const tc = await transaction.findAll({
    where: {
      isCancel: false,
      [Op.or]: [
        { event: "withdraw" },
        { event: "add" },
        { event: "bonus" },
        { event: "comission" },
      ],
    },
  });
  return tc;
};

//get Win Lose And sum
const getWinLose = async (id) => {
  const tc = await transaction.findAll({
    where: {
      isCancel: false,
      isComission: false,
      [Op.or]: [{ event: "win" }, { event: "lose" }],
    },
  });
  return tc;
};

const getWinLoseById = async (id) => {
  const tc = await transaction.findAll({
    where: {
      isCancel: false,
      userId: id,
      [Op.or]: [{ event: "win" }, { event: "lose" }],
    },
  });
  return tc;
};

const getTrasactionByRounndId = async (id) => {
  const tc = await transaction.findAll({
    where: {
      isCancel: false,
      roundId: id,
    },
  });
  return tc;
};

//update cancel transaction
const updateTransaction = async (id) => {
  const tc = await transaction.update(
    { isComission: true },
    {
      where: {
        id: id,
      },
    }
  );
  return tc;
};

const getAllByDate = async (start, end, id) => {
  // Constructing the query
  let transactions = [];
  if (id === undefined || id === "0") {
    transactions = await transaction.findAll({
      attributes: [
        "event",
        [db.sequelize.fn("SUM", db.sequelize.col("unit")), "totalUnits"],
        "date",
      ],
      where: {
        [Op.or]: [
          { event: "withdraw" },
          { event: "add" },
          { event: "bonus" },
          { event: "comission" },
        ],
        createdAt: {
          [Op.between]: [start, end],
        },
      },
      group: ["event", "date"],
      order: [["date", "DESC"]],
    });
  } else {
    transactions = await transaction.findAll({
      attributes: [
        "event",
        [db.sequelize.fn("SUM", db.sequelize.col("unit")), "totalUnits"],
        "date",
      ],
      where: {
        [Op.or]: [
          { event: "withdraw" },
          { event: "add" },
          { event: "bonus" },
          { event: "comission" },
        ],
        createdAt: {
          [Op.between]: [start, end],
        },
        partner_id: parseInt(id),
      },
      group: ["event", "date"],
      order: [["date", "DESC"]],
    });
  }

  return transactions;
};
module.exports = {
  getAllByDate,
  getWinLoseById,
  getAllTransactionNoCancel,
  getTrasactionByRounndId,
  updateTransaction,
  getWinLose,
  createTransaction,
  getAllTransaction,
  getWinLoseCom,
};
