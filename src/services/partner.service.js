const db = require("../models");
const partner = db.partner;

const getPartnerByDestination = async (id) => {
  //find user from uuid
  const user = partner.findOne({
    where: {
      uid: id,
    },
  });
  return user;
};
module.exports = {
  getPartnerByDestination,
};
