const db = require("../models");
const rounds = db.rounds;
const roundDetail = db.round_detail;
const Op = db.Sequelize.Op;
const fn = db.Sequelize.fn;
const col = db.Sequelize.col;

const getAllGroupIdLine = async () => {
  const groupAllId = await rounds.findAll({
    attributes: [[fn("DISTINCT", col("groupId")), "groupId"]],
    distinct: true,
  });

  return groupAllId;
};

const createRound = async (data) => {
  const createRound = await rounds.create(data);
  return createRound;
};

const closeRound = async (id, data) => {
  const closeRound = await rounds.update(
    {
      groupId: data,
      isClose: true,
    },
    {
      where: {
        id: id,
      },
    }
  );
  return closeRound;
};

const updateKa = async (id, data) => {
  const updateKa = await rounds.update(
    {
      k0: data[0].number,
      k1: data[1].number,
      k2: data[2].number,
      k3: data[3].number,
      k4: data[4].number,
      k5: data[5].number,
      k6: data[6].number,
    },
    {
      where: {
        id: id,
      },
    }
  );
  return updateKa;
};

const updateTotal = async (id, sumTotal, difference) => {
  const updateTotal = await rounds.update(
    {
      sumTotal: sumTotal,
      difference: difference,
    },
    {
      where: {
        id: id,
      },
    }
  );
  return updateTotal;
};
const closeStatus = async (id, data) => {
  const closeRound = await rounds.update(
    {
      groupId: data,
      type: "success",
    },
    {
      where: {
        id: id,
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
        id: data,
      },
    }
  );
  return cancelRound;
};
const getRound = async (data) => {
  const count = await rounds.findAll({
    order: [["createdAt", "DESC"]],
    limit: 1,
    where: {
      groupId: data,
      type: {
        [Op.or]: ["success", "cancel"],
      },
      openRoundAt: {
        [Op.lte]: new Date(),
      },
    },
  });
  return count;
  //get count
  // const count = await rounds.count({
  //   where: {
  //     groupId: data,
  //     type: "success",
  //     openRoundAt: {
  //       [Op.lte]: new Date(),
  //     },
  //   },
  // });
  // return count;
};
const getCountRoundInProgress = async (data) => {
  //get count
  const count = await rounds.count({
    where: {
      groupId: data,
      isClose: false,
      openRoundAt: {
        [Op.lte]: new Date(),
      },
    },
  });
  return count;
};
const getCountRoundInProAndclose = async (data) => {
  //get count
  const count = await rounds.count({
    where: {
      groupId: data,
      type: "inProgress",
      isClose: true,
      openRoundAt: {
        [Op.lte]: new Date(),
      },
    },
  });
  return count;
};
const getRoundIdinProgress = async (data) => {
  //get count
  const round = await rounds.findOne({
    where: {
      groupId: data,
      isClose: false,
      type: "inProgress",
    },
  });
  return round;
};
const getCloseRoundAndinProgress = async (data) => {
  //get count
  const round = await rounds.findOne({
    where: {
      groupId: data,
      isClose: true,
      type: "inProgress",
    },
    order: [["createdAt", "DESC"]],
  });
  return round;
};
const checkRoundInprogress = async (data) => {
  const round = await rounds.findOne({
    where: {
      groupId: data,
      type: "inProgress",
      openRoundAt: {
        [Op.lte]: new Date(),
      },
    },
  });
  return round;
};

const getRoundDetailByuserId = async (id) => {
  const round = await roundDetail.findOne({
    where: {
      isCancel: false,
      userId: id,
    },
  });
  return round;
};

const createRoundDetail = async (data) => {
  const createRoundDetail = await roundDetail.bulkCreate(data);
  return createRoundDetail;
};

const getAllRoundDetailByRoundId = async (id) => {
  const round = await roundDetail.findAll({
    include: [
      {
        model: db.Users,
        attributes: ["name", "uuid_line"],
      },
    ],
    where: {
      isCancel: false,
      roundId: id,
    },
  });
  return round;
};
const getAllRoundDetailByRoundIdAndUserId = async (roundId, userId) => {
  const round = await roundDetail.findAll({
    include: [
      {
        model: db.Users,
        attributes: ["name", "uuid_line"],
      },
    ],
    where: {
      isCancel: false,
      roundId: roundId,
      userId: userId,
    },
  });
  return round;
};

const updateRoundDetail = async (id) => {
  const round = await roundDetail.update(
    {
      isCancel: true,
    },
    {
      where: {
        id: id,
      },
    }
  );
  return round;
};

module.exports = {
  createRound,
  getRound,
  checkRoundInprogress,
  closeRound,
  cancelRound,
  getRoundIdinProgress,
  getCountRoundInProgress,
  getRoundDetailByuserId,
  createRoundDetail,
  getAllRoundDetailByRoundId,
  getCountRoundInProAndclose,
  closeStatus,
  getAllRoundDetailByRoundIdAndUserId,
  getCloseRoundAndinProgress,
  updateRoundDetail,
  updateKa,
  updateTotal,
  getAllGroupIdLine,
};
