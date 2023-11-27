const db = require("../models");
const users = db.Users;
const Op = db.Sequelize.Op;

const getAlluser = async () => {
  const user = await users.findAll();
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
module.exports = {
  register,
  getCreadit,
  addCredit,
  getCreaditByuserId,
  updateCredit,
  getIdByUUid,
  getAlluser,
};
