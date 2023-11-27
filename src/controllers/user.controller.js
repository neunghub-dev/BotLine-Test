const usersService = require("../services/users.service");
const transactionService = require("../services/transaction.service");

const getAlluser = async (req, res) => {
  try {
    const user = await usersService.getAlluser();
    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (error) {}
};

const manageCredit = async (req, res) => {
  try {
    const userId = req.params.id;
    const adminId = 1;
    const { event, credit } = req.body;
    if (!userId || !credit || !event) {
      return res.status(400).json({
        status: false,
        message: "Please fill in all fields",
      });
    } else {
      const getUser = await usersService.getCreadit(userId);
      if (!getUser) {
        return res.status(400).json({
          status: false,
          message: "Please fill in all fields",
        });
      } else {
        if (event === "add") {
          const newCredit = parseInt(getUser.credit) + parseInt(credit);
          const addCredit = await usersService.addCredit(newCredit, userId);
          if (!addCredit) {
            return res.status(400).json({
              status: false,
              message: "Please fill in all fields",
            });
          } else {
            const data = {
              userId: userId,
              unit: credit,
              event: "add",
              adminId: adminId,
            };
            const createTransaction =
              await transactionService.createTransaction(data);
            if (!createTransaction) {
              return res.status(400).json({
                status: false,
                message: "Please fill in all fields",
              });
            } else {
              return res.status(200).json({
                status: true,
                message: "Add credit success",
              });
            }
          }
        } else if (event === "withdraw") {
          const newCredit = parseInt(getUser.credit) - parseInt(credit);
          if (newCredit < 0) {
            return res.status(400).json({
              status: false,
              message: "Credit not enough",
            });
          } else {
            const addCredit = await usersService.addCredit(newCredit, userId);
            if (!addCredit) {
              return res.status(400).json({
                status: false,
                message: "Please fill in all fields",
              });
            } else {
              const data = {
                userId: userId,
                unit: credit,
                event: "withdraw",
                adminId: adminId,
              };
              const createTransaction =
                await transactionService.createTransaction(data);
              if (!createTransaction) {
                return res.status(400).json({
                  status: false,
                  message: "Please fill in all fields",
                });
              } else {
                return res.status(200).json({
                  status: true,
                  message: "Add credit success",
                });
              }
            }
          }
        }
      }
    }
  } catch (error) {}
};

module.exports = {
  manageCredit,
  getAlluser,
};
