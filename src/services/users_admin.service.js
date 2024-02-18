const db = require("../models");
const users_admins = db.users_admins;
const Op = db.Sequelize.Op;

const checkUser = async (id) => {
  //find user from uuid
  const user = users_admins.findOne({
    include: [
      {
        model: db.partner,
      },
    ],
    where: {
      uuid: id,
    },
  });
  return user;
};

//add useradmin
const addUserAdmin = async (data) => {
  const user = await users_admins.create(data);
  return user;
};

const getAllUserAdmin = async (id) => {
  console.log("-------");
  console.log(id);
  console.log("-------");
  if (id === undefined || id === 0) {
    const user = await users_admins.findAll();
    return user;
  } else {
    const user = await users_admins.findAll({
      where: {
        partner_id: id,
      },
    });
    return user;
  }
};

const destroyUserAdmin = async (id) => {
  const user = await users_admins.destroy({
    where: {
      id: id,
    },
  });
  return user;
};
module.exports = {
  getAllUserAdmin,
  destroyUserAdmin,
  checkUser,
  addUserAdmin,
};
