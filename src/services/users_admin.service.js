const db = require("../models");
const users_admins = db.users_admins;
const Op = db.Sequelize.Op;

const checkUser = async (id) => {
  //find user from uuid
  const user = users_admins.findOne({
    where: {
      uuid: id,
    },
  });
  return user;

};

module.exports = {
  checkUser,
};
