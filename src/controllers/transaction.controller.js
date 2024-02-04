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

const getAllTransactionByPartner = async (req, res) => {
  try {
    const partner_id = req.partner_id;
    const user = await transactionService.getAllTransactionNoCancel(partner_id);

    const eventSummary = {
      add: 0,
      withdraw: 0,
      bonus: 0,
    };

    user.forEach((item) => {
      const { event, unit } = item;
      eventSummary[event] += unit;
    });

    return res.status(200).json({
      status: true,
      messaage: "Get all transaction success",
      data: eventSummary,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Get all transaction fail",
      data: error,
    });
  }
};

module.exports = {
  getAllTransactionByPartner,
  getAllTransaction,
};
