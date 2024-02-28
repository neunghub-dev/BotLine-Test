const usersService = require("../services/users.service");
const transactionService = require("../services/transaction.service");
const adminService = require("../services/admin.service");
const partnerService = require("../services/partner.service");
const bcrypt = require("bcryptjs");

const getAlluser = async (req, res) => {
  try {
    let user = [];
    const pdId = req.partnerId;
    const { keyword } = req.query;

    if (keyword) {
      user = await usersService.getAlluser(keyword, pdId);
      if (!user) {
        return res.status(200).json({
          status: false,
          message: "User not found",
        });
      }
    } else {
      user = await usersService.getAlluser(undefined, pdId);
      // return res.status(200).json({
      //   status: true,
      //   data: user,
      // });
    }
    // const user = await usersService.getAlluser();

    const json = JSON.stringify(user);
    const userJson = JSON.parse(json);
    const newData = userJson.map((item) => ({
      ...item,
      add: 0,
      withdraw: 0,
      win: 0,
      lose: 0,
      commision: 0,
      total: 0,
      allWin: 0,
      allLose: 0,
      isWin: 0,
      isLose: 0,
      allCommision: 0,
      partner: {},
    }));

    const tc = await transactionService.getWinLose();
    const tcm = await transactionService.getWinLoseCom();
    // console.log(tcm);
    const allTransaction = await transactionService.getAllTransaction();

    const bonus = [];
    const credit = [];
    const ttcom = [];

    allTransaction.forEach((event) => {
      const userIndex = credit.findIndex((u) => u.userId === event.userId);
      if (userIndex === -1) {
        // User not found, create a new user entry
        credit.push({
          userId: event.userId,
          data: [
            {
              event: event.event,
              unit: event.unit,
            },
          ],
        });
      } else {
        // User found, update the existing entry
        const eventData = credit[userIndex].data.find(
          (d) => d.event === event.event
        );

        if (eventData) {
          // Event type found, update the units
          eventData.unit += event.unit;
        } else {
          // Event type not found, create a new entry for the event
          credit[userIndex].data.push({
            event: event.event,
            unit: event.unit,
          });
        }
      }
    });
    for (let event of tc) {
      const userIndex = bonus.findIndex((u) => u.userId === event.userId);
      if (userIndex === -1) {
        const user = await usersService.getUserById(event.userId);
        // User not found, create a new user entry
        bonus.push({
          userId: event.userId,
          invite_id: user.invite_id,
          data: [
            {
              event: event.event,
              unit: event.unit,
            },
          ],
        });
      } else {
        // User found, update the existing entry
        const eventData = bonus[userIndex].data.find(
          (d) => d.event === event.event
        );
        if (eventData) {
          // Event type found, update the units
          eventData.unit += event.unit;
        } else {
          // Event type not found, create a new entry for the event
          bonus[userIndex].data.push({
            event: event.event,
            unit: event.unit,
          });
        }
      }
    }
    for (let event of tcm) {
      const userIndex = ttcom.findIndex((u) => u.userId === event.userId);
      console.log(userIndex);
      if (userIndex === -1) {
        const user = await usersService.getUserById(event.userId);
        console.log(user);
        // User not found, create a new user entry
        ttcom.push({
          userId: event.userId,
          invite_id: user.invite_id,
          data: [
            {
              event: event.event,
              unit: event.unit,
            },
          ],
        });
      } else {
        // User found, update the existing entry
        const eventData = ttcom[userIndex].data.find(
          (d) => d.event === event.event
        );
        if (eventData) {
          // Event type found, update the units
          eventData.unit += event.unit;
        } else {
          // Event type not found, create a new entry for the event
          ttcom[userIndex].data.push({
            event: event.event,
            unit: event.unit,
          });
        }
      }
    }
    console.log(JSON.stringify(ttcom, null, 2));
    newData.forEach((user) => {
      const userIndex2 = credit.findIndex((u) => u.userId === user.id);

      if (userIndex2 !== -1) {
        const userData = credit[userIndex2].data;
        const add = userData.find((event) => event.event === "add")?.unit || 0;
        const withdraw =
          userData.find((event) => event.event === "withdraw")?.unit || 0;
        const bonus =
          userData.find((event) => event.event === "bonus")?.unit || 0;
        const comission =
          userData.find((event) => event.event === "comission")?.unit || 0;
        user.bonus = bonus + comission;
        user.add = add;
        user.withdraw = withdraw;
        user.credit = user.credit;
      }
      let win = 0;
      let lose = 0;
      let iswin = 0;
      let islose = 0;
      bonus.forEach((event) => {
        if (event.userId === user.id) {
          event.data.forEach((event) => {
            if (event.event === "win") {
              iswin += event.unit;
            } else if (event.event === "lose") {
              islose += event.unit;
            }
          });
        }
        if (event.invite_id === user.id) {
          event.data.forEach((event) => {
            if (event.event === "win") {
              win += event.unit;
            } else if (event.event === "lose") {
              lose += event.unit;
            }
          });
        }
      });
      let allWin = 0;
      let allLose = 0;
      ttcom.forEach((event) => {
        if (event.invite_id === user.id) {
          event.data.forEach((event) => {
            if (event.event === "win") {
              allWin += event.unit;
            } else if (event.event === "lose") {
              allLose += event.unit;
            }
          });
        }
      });
      console.log("-----------");
      console.log(win);
      console.log(lose);
      console.log("-----------");
      const total = allWin + allLose;
      user.allWin = allWin;
      user.allLose = allLose;
      user.allCommision = total <= 0 ? 0 : total * 0.005;
      user.win = win;
      user.lose = lose;
      user.isWin = iswin;
      user.isLose = islose;
    });

    for (let user of newData) {
      const total = user.win + user.lose;
      user.commision = total <= 0 ? 0 : total * 0.005;
      user.total = user.credit;
      user.partner = await partnerService.getPartnerById(user.partner_id);
    }

    // console.log(user);
    return res.status(200).json({
      status: true,
      data: newData,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error,
    });
  }
};
const addCommision = async (req, res) => {
  const adminId = req.userId;
  const { userId } = req.body;
  const user = await usersService.getCreadit(userId);
  const getUser = await usersService.getIdByInvite(userId);
  //convert getUser to array

  const json = JSON.stringify(getUser);
  const userJson = JSON.parse(json);
  const arrayOfIds = userJson.map((obj) => obj.id);

  const transaction = await transactionService.getWinLoseById(arrayOfIds);

  let winSum = 0;
  let loseSum = 0;

  // Loop through the data array
  transaction.forEach((item) => {
    // Check if the event is "win" or "lose"
    if (item.event === "win") {
      winSum += item.unit;
    } else if (item.event === "lose") {
      loseSum += item.unit;
    }
  });
  let total = (winSum + loseSum) * 0.005;
  if (total > 0) {
    const newCredit = parseFloat(user.credit) + parseFloat(total);
    console.log(newCredit);
    const addCredit = await usersService.addCredit(
      parseFloat(newCredit),
      userId
    );

    if (addCredit) {
      for (let x of transaction) {
        await transactionService.updateTransaction(x.id);
      }
    }
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const data = {
      userId: userId,
      unit: total,
      event: "comission",
      adminId: adminId,
      isSelect: true,
      isCancel: false,
      partner_id: user.partner_id,
      date: startDate,
    };
    console.log(data);
    const createTransaction = await transactionService.createTransaction(data);
    if (createTransaction) {
      return res.status(200).json({
        status: true,
        message: "Add commision success",
      });
    }
    // return res.status(200).json({
    //   status: true,
    //   message: "Add commision success",
    // });
  } else {
    return res.status(200).json({
      status: false,
      message: "No commision",
    });
  }
};

const manageCredit = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

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
              isSelect: true,
              isCancel: false,
              partner_id: getUser.partner_id,
              date: currentDate,
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
                isSelect: true,
                isCancel: false,
                partner_id: getUser.partner_id,
                date: currentDate,
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
        } else if (event === "bonus") {
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
              event: "bonus",
              adminId: adminId,
              isSelect: true,
              isCancel: false,
              partner_id: getUser.partner_id,
              date: currentDate,
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
  } catch (error) {
    console.log(error);
  }
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
    const { username, password, name, role, tel, partner_id } = req.body;
    if (!username || !password || !name || !role || !tel || !partner_id) {
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
          role: role,
          tel: tel,
          username: username,
          password: hashedPassword,
          partner_id: partner_id,
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
    const pdId = req.partnerId;
    const user = await adminService.getAllAdmin(pdId);
    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, tel, line_id, invite_id } = req.body;
    if (!userId || !name || !tel || !line_id || !invite_id) {
      return res.status(400).json({
        status: false,
        message: "Please fill in all fields",
      });
    } else {
      const iv = invite_id.toString();
      const us = userId.toString();
      if (iv === us) {
        return res.status(400).json({
          status: false,
          message: "Invite id can't be same as user id",
        });
      }
      const data = {
        name: name,
        tel: tel,
        line_id: line_id,
        invite_id: invite_id,
      };
      const updateUser = await usersService.updateInfo(data, userId);
      if (!updateUser) {
        return res.status(400).json({
          status: false,
          message: "Please fill in all fields",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Update user success",
        });
      }
    }
  } catch (error) {}
};
module.exports = {
  updateUser,
  manageCredit,
  getAlluser,
  createUser,
  getAllAdmin,
  addCommision,
};
