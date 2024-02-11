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
      if (item.event === "comission") {
        eventSummary["bonus"] += unit;
      }

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

const convertToUTCPlus7 = async (dateStr) => {
  const date = new Date(dateStr);
  const options = {
    timeZone: "Asia/Bangkok", // UTC+07:00
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return date.toLocaleString("en-US", options);
};
const getAllTransactionByDate = async (req, res) => {
  try {
    const { start, end, partner_id } = req.query;
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 0, 0);
    const user = await transactionService.getAllByDate(
      startDate,
      endDate,
      partner_id
    );

    for (let i of user) {
      i.date = await convertToUTCPlus7(i.date);
      // i.dataValues.date = date.dataValues.date.split(",")[0];
    }
    const json = JSON.stringify(user);
    const data = JSON.parse(json);
    const data1 = [];

    for (let i of data) {
      const userIndex = data1.findIndex((item) => item.date === i.date);

      if (userIndex === -1) {
        data1.push({
          date: i.date,
          add: i.event === "add" ? parseInt(i.totalUnits) : 0,
          withdraw: i.event === "withdraw" ? parseInt(i.totalUnits) : 0,
          bonus: i.event === "bonus" ? parseInt(i.totalUnits) : 0,
          comission: i.event === "comission" ? parseInt(i.totalUnits) : 0,
        });
      } else {
        // Accumulate totalUnits based on event type
        if (i.event === "add") {
          data1[userIndex].add += parseInt(i.totalUnits);
        } else if (i.event === "withdraw")
          data1[userIndex].withdraw += parseInt(i.totalUnits);
        else if (i.event === "bonus" || i.event === "comission")
          data1[userIndex].bonus += parseInt(i.totalUnits);
      }
    }

    const result = [
      {
        event: "add",
        date: [],
        result: [],
      },
      {
        event: "withdraw",
        date: [],
        result: [],
      },
      {
        event: "bonus",
        date: [],
        result: [],
      },
    ];

    data1.forEach((item) => {
      result.forEach((event) => {
        if (event.event === "add") {
          event.date.push(item.date.substring(0, 10));
          event.result.push(item.add);
        } else if (event.event === "withdraw") {
          event.date.push(item.date.substring(0, 10));
          event.result.push(item.withdraw);
        } else if (event.event === "bonus") {
          event.date.push(item.date.substring(0, 10));
          event.result.push(item.bonus + item.comission);
        }
      });
    });

    // // Iterate through the data and accumulate the units based on date and event
    // user.forEach((item) => {
    //   const date = item.createdAt.split("T")[0];
    //   if (!groupedData[date]) {
    //     groupedData[date] = {};
    //   }
    //   if (!groupedData[date][item.event]) {
    //     groupedData[date][item.event] = 0;
    //   }
    //   groupedData[date][item.event] += item.unit;
    // });

    // // Initialize an array to store the output
    // const output = [];

    // // Iterate through the groupedData and format the output
    // for (const date in groupedData) {
    //   for (const event in groupedData[date]) {
    //     output.push({
    //       date: date,
    //       event: event,
    //       unit: groupedData[date][event],
    //     });
    //   }
    // }

    // console.log(output);
    return res.status(200).json({
      status: true,
      messaage: "Get all transaction success",
      data: result,
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
  getAllTransactionByDate,
  getAllTransactionByPartner,
  getAllTransaction,
};
