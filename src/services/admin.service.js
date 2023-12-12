const db = require("../models");
const admins = db.admins;

const checkUsername = async (username) => {
  const user = await admins.findOne({
    where: {
      username: username,
    },
  });
  return user;
};
const createUser = async (data) => {
  const createUser = await admins.create(data);
  return createUser;
};
const getAllAdmin = async () => {
  const user = await admins.findAll({
    attributes: ["id", "name", "tel", "username", "role"],
  });
  return user;
};
const getProfile = async (id) => {
  const user = await admins.findOne({
    attributes: ["id", "name", "tel", "role"],
    where: {
      id: id,
    },
  });
  return user;
};
module.exports = {
  getAllAdmin,
  checkUsername,
  createUser,
  getProfile,
};
