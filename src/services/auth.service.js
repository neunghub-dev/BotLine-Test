const db = require("../models");
const users = db.admins;

const login = async (username) => {
  return await users.findOne({
    attributes: ["id", "password", "role", "name"],
    where: {
      username: username,
    },
  });
};

module.exports = {
  login,
};
