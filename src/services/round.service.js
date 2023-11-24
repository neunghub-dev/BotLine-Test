const db = require("../models");
const rounds = db.rounds;
const Op = db.Sequelize.Op;

const createRound = async (data) => {
  const createRound = await rounds.create(data);
  return createRound;
};

const closeRound = async (data) => {
  const closeRound = await rounds.update(
    {
      type: "success",
      isClose: true,
    },
    {
      where: {
        id: data,
      },
    }
  );
  return closeRound;
};

const cancelRound = async (data) => {
  const cancelRound = await rounds.update(
    {
      type: "cancel",
      isClose: true,
    },
    {
      where: {
        id: id,
      },
    }
  );
  return cancelRound;
};
const getRound = async (date) => {
  //get count
  const count = await rounds.count({
    where: {
      type: "success",
      openRoundAt: {
        [Op.lte]: new Date(),
      },
    },
  });
  return count;
};
const getRoundIdinProgress = async (id) => {
  //get count
  const round = await rounds.findOne({
    where: {
      type: "inProgress",
      openRoundAt: {
        [Op.lte]: new Date(),
      },
    },
  });
  return round;
};
const checkRoundInprogress = async () => {
  const round = await rounds.findOne({
    where: {
      type: "inProgress",
      openRoundAt: {
        [Op.lte]: new Date(),
      },
    },
  });
  return round;
};
module.exports = {
  createRound,
  getRound,
  checkRoundInprogress,
  closeRound,
  cancelRound,
  getRoundIdinProgress,
};
