const partnerService = require("../services/partner.service");

//get all partner
const getAllPartners = async (req, res) => {
  try {
    const partner = await partnerService.getAllPartner();
    console.log(partner);
    return res.status(200).json({
      status: true,
      message: "Get all partner success",
      data: partner,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: "Get all partner fail",
      data: error,
    });
  }
};

const getPartnerByRefCode = async (req, res) => {
  try {
    const { refCode } = req.query;
    const partner = await partnerService.getPartnerByRefCode(refCode);
    return res.status(200).json({
      status: true,
      message: "Get partner by refCode success",
      data: partner,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: "Get partner by refCode fail",
      data: error,
    });
  }
};
//get partner by refCode

module.exports = {
  getPartnerByRefCode,
  getAllPartners,
};
