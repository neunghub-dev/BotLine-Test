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

//get all partner
const getAllPartner = async () => {
  const partners = partner.findAll();
  return partners;
};

//get partner by refCode
const getPartnerByRefCode = async (refCode) => {
  const partners = partner.findOne({
    where: {
      refCode: refCode,
    },
  });
  return partners;
};
module.exports = {
  getPartnerByRefCode,
  getPartnerByDestination,
  getAllPartner,
};
