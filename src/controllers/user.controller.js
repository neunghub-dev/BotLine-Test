const usersService = require("../services/users.service");
const transactionService = require("../services/transaction.service");
const adminService = require("../services/admin.service");
const bcrypt = require("bcryptjs");

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
    const adminId = req.userId;
    const userId = req.params.id;
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

const createUser = async (req, res) => {
  try {
    const thisRole = req.role;
    if (thisRole === "admin") {
      return res.status(400).json({
        status: false,
        message: "You don't have permission",
      });
    }
    const { username, password, name, role, tel } = req.body;
    if (!username || !password || !name || !role || !tel) {
      return res.status(400).json({
        status: false,
        message: "Please fill in all fields",
      });
    } else {
      const checkUsername = await adminService.checkUsername(username);
      console.log(checkUsername);
      if (checkUsername) {
        return res.status(400).json({
          status: false,
          message: "Username already exists",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = {
          name: name,
          role: "admin",
          tel: tel,
          username: username,
          password: hashedPassword,
        };
        const createUser = await adminService.createUser(data);
        if (!createUser) {
          return res.status(400).json({
            status: false,
            message: "Please fill in all fields",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Create user success",
          });
        }
      }
    }
  } catch (error) {}
};
const getAllAdmin = async (req, res) => {
  try {
    const user = await adminService.getAllAdmin();
    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  manageCredit,
  getAlluser,
  createUser,
  getAllAdmin,
};
