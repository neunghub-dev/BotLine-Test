const db = require("../models");
const users = db.Users;
const Op = db.Sequelize.Op;

const getAlluser = async (keyword, partner_id) => {
  console.log("keyword", keyword);
  console.log("partner_id", partner_id);
  let user = [];
  // let whereClause = {};
  if (partner_id !== undefined && partner_id !== 0) {
    if (keyword !== undefined) {
      user = await users.findAll({
        where: {
          partner_id: partner_id,
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { tel: { [Op.like]: `%${keyword}%` } },
            { line_id: { [Op.like]: `%${keyword}%` } },
          ],
        },
      });
    } else {
      user = await users.findAll({
        where: {
          partner_id: partner_id,
        },
      });
    }
  } else {
    if (keyword !== undefined) {
      user = await users.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { tel: { [Op.like]: `%${keyword}%` } },
            { line_id: { [Op.like]: `%${keyword}%` } },
          ],
        },
      });
    } else {
      user = await users.findAll();
    }
  }

  // console.log(JSON.stringify(whereClause, null, 2));

  return user;
};

const register = async (data) => {
  const createUser = await users.create(data);
  return createUser;
};

const getCreadit = async (id) => {
  const user = await users.findOne({
    attributes: ["credit"],
    where: {
      id: id,
    },
  });
  return user;
};

const getIdByUUid = async (uuid) => {
  const user = await users.findOne({
    attributes: ["id"],
    where: {
      uuid_line: uuid,
    },
  });
  return user;
};

const getCreaditByuserId = async (id) => {
  const user = await users.findOne({
    attributes: ["credit"],
    where: {
      uuid_line: id,
    },
  });
  return user;
};

const addCredit = async (credit, id) => {
  const user = await users.update(
    {
      credit: credit,
    },
    {
      where: {
        id: id,
      },
    }
  );
  return user;
};

const updateCredit = async (credit, uuid) => {
  const user = await users.update(
    {
      credit: credit,
    },
    {
      where: {
        uuid_line: uuid,
      },
    }
  );
  return user;
};
const updateCreditById = async (credit, id) => {
  const user = await users.update(
    {
      credit: credit,
    },
    {
      where: {
        id: id,
      },
    }
  );
  return user;
};
const checkuuid = async (uuid) => {
  const user = await users.findOne({
    where: {
      uuid_line: uuid,
    },
  });
  return user;
};
module.exports = {
  register,
  getCreadit,
  addCredit,
  getCreaditByuserId,
  updateCredit,
  getIdByUUid,
  getAlluser,
  checkuuid,
  updateCreditById,
};
