const transactionService = require("../services/transaction.service");

const getAllTransaction = async (req, res) => {
  try {
    if (req.role === "admin") {
      return res.status(403).json({
        status: false,
        message: "permission denied",
      });
    }
    const user = await transactionService.getAllTransaction();
    return res.status(200).json({
      status: true,
      messaage: "Get all transaction success",
      data: user,
    });
  } catch (error) {}
};

module.exports = {
  getAllTransaction,
};
