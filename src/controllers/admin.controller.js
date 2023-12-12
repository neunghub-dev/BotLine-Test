const adminService = require("../services/admin.service");

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await adminService.getProfile(userId);
    return res.status(200).json({
      status: true,
      message: "Get profile success",
      data: user,
    });
  } catch (error) {}
};

module.exports = {
  getProfile,
};
