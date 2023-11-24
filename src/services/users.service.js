const db = require("../models");
const users = db.Users;
const Op = db.Sequelize.Op;

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
module.exports = {
  register,
  getCreadit,
  addCredit,
};
